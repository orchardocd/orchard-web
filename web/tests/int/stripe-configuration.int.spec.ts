import { execFileSync } from 'node:child_process'
import { mkdtemp, readFile, rm, stat, symlink, writeFile } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { parseEnv } from 'node:util'
import { afterEach, describe, expect, it } from 'vitest'

const script = path.resolve('scripts/configure-stripe.mjs')
const directories: string[] = []
const origin = 'https://new.orchardocd.org'
const secretKey = 'sk_test_fixture123'
const original = 'PAYLOAD_SECRET="keep#this=value"\nDATABASE_URL=file:/srv/orchard/data/web.db\n'

function configure(filename: string, siteUrl = origin, input = secretKey) {
  execFileSync(process.execPath, [script, filename, siteUrl], { input, stdio: 'pipe' })
}

async function fixture(content = original) {
  const directory = await mkdtemp(path.join(os.tmpdir(), 'orchard-stripe-config-'))
  directories.push(directory)
  const filename = path.join(directory, 'app.env')
  await writeFile(filename, content, { mode: 0o644 })
  return filename
}

afterEach(async () => {
  await Promise.all(directories.splice(0).map((directory) => rm(directory, { recursive: true })))
})

describe('Stripe configuration command', () => {
  it('adds donation settings while preserving unrelated settings and restricting file access', async () => {
    const filename = await fixture()

    configure(filename)

    expect(await readFile(filename, 'utf8')).toBe(
      `${original}STRIPE_SECRET_KEY=${secretKey}\nSITE_URL=${origin}\n`,
    )
    expect((await stat(filename)).mode & 0o777).toBe(0o600)
    expect(parseEnv(await readFile(filename, 'utf8'))).toEqual({
      PAYLOAD_SECRET: 'keep#this=value',
      DATABASE_URL: 'file:/srv/orchard/data/web.db',
      STRIPE_SECRET_KEY: secretKey,
      SITE_URL: origin,
    })
  })

  it('replaces duplicate and quoted donation assignments without changing other lines', async () => {
    const filename = await fixture(
      `STRIPE_SECRET_KEY=sk_live_old\n${original}export STRIPE_SECRET_KEY='sk_test_old'\nSITE_URL="https://old.example"\n SITE_URL \t=\t 'https://duplicate.example'\n`,
    )

    configure(filename)

    expect(await readFile(filename, 'utf8')).toBe(
      `${original}STRIPE_SECRET_KEY=${secretKey}\nSITE_URL=${origin}\n`,
    )
  })

  it('preserves multiline settings containing donation-like lines', async () => {
    const content = `${original}MAIL_SIGNATURE="Hello\nSTRIPE_SECRET_KEY=embedded\nSITE_URL=embedded\nGoodbye"\n`
    const filename = await fixture(content)

    configure(filename)

    expect(await readFile(filename, 'utf8')).toBe(
      `${content}STRIPE_SECRET_KEY=${secretKey}\nSITE_URL=${origin}\n`,
    )
  })

  it('preserves unrelated continued lines', async () => {
    const content = `${original}EXTRA_SETTING=continued\\\nvalue\n`
    const filename = await fixture(content)

    configure(filename)

    expect(await readFile(filename, 'utf8')).toBe(
      `${content}STRIPE_SECRET_KEY=${secretKey}\nSITE_URL=${origin}\n`,
    )
  })

  it('preserves CRLF line endings and handles a missing final newline', async () => {
    const content = original.replaceAll('\n', '\r\n').trimEnd()
    const filename = await fixture(content)

    configure(filename)

    expect(await readFile(filename, 'utf8')).toBe(
      `${content}\r\nSTRIPE_SECRET_KEY=${secretKey}\r\nSITE_URL=${origin}\r\n`,
    )
  })

  it('preserves a UTF-8 byte order mark on unrelated settings', async () => {
    const content = `\uFEFF${original}`
    const filename = await fixture(content)

    configure(filename)

    expect(await readFile(filename, 'utf8')).toBe(
      `${content}STRIPE_SECRET_KEY=${secretKey}\nSITE_URL=${origin}\n`,
    )
  })

  it('updates an empty environment file and can be repeated', async () => {
    const filename = await fixture('')

    configure(filename)
    configure(filename)

    expect(await readFile(filename, 'utf8')).toBe(
      `STRIPE_SECRET_KEY=${secretKey}\nSITE_URL=${origin}\n`,
    )
  })

  it.each(['', '\n', '\r\n'])('accepts a live secret with terminal %j', async (ending) => {
    const filename = await fixture()

    configure(filename, `${origin}/`, `sk_live_fixture123${ending}`)

    expect(parseEnv(await readFile(filename, 'utf8'))).toMatchObject({
      STRIPE_SECRET_KEY: 'sk_live_fixture123',
      SITE_URL: origin,
    })
  })

  it.each(['http://localhost:3000', 'http://127.0.0.1:3000', 'http://[::1]:3000'])(
    'accepts local development origin %s',
    async (siteUrl) => {
      const filename = await fixture()

      configure(filename, siteUrl)

      expect(parseEnv(await readFile(filename, 'utf8')).SITE_URL).toBe(siteUrl)
    },
  )

  it.each([
    '',
    'pk_live_fixture123',
    'sk_test_',
    'sk_test_bad value',
    ' sk_test_fixture123',
    'sk_test_fixture123\n\n',
    'sk_test_fixture123\nPAYLOAD_SECRET=replaced',
    `sk_test_${'a'.repeat(4096)}`,
  ])('rejects invalid secret input %j', async (input) => {
    const filename = await fixture()
    expect(() => configure(filename, origin, input)).toThrow()
  })

  it.each([
    '',
    'not-a-url',
    'http://new.orchardocd.org',
    'ftp://new.orchardocd.org',
    'https://user:password@new.orchardocd.org',
    'https://new.orchardocd.org/donate',
    'https://new.orchardocd.org?query=value',
    'https://new.orchardocd.org#fragment',
    ' https://new.orchardocd.org',
    'https://new.orchardocd.org\n',
  ])('rejects invalid origin %j', async (siteUrl) => {
    const filename = await fixture()
    expect(() => configure(filename, siteUrl)).toThrow()
  })

  it.each([
    'STRIPE_SECRET_KEY="sk_test_first\nsecond"\n',
    'SITE_URL="https://first.example\nsecond"\n',
    'SITE_URL=https://first.example\\\nsecond\n',
    'STRIPE_SECRET_KEY="unfinished\n',
    'PAYLOAD_SECRET="ambiguous\\"value"\n',
  ])('rejects ambiguous or multiline managed settings %j', async (content) => {
    const filename = await fixture(content)
    expect(() => configure(filename)).toThrow()
  })

  it('rejects a missing environment file', async () => {
    const filename = await fixture()
    expect(() => configure(path.join(path.dirname(filename), 'missing.env'))).toThrow()
  })

  it('rejects a symbolic link environment file', async () => {
    const filename = await fixture()
    const link = path.join(path.dirname(filename), 'linked.env')
    await symlink(filename, link)
    expect(() => configure(link)).toThrow()
  })

  it.each([{ args: [] }, { args: ['app.env'] }, { args: ['app.env', origin, 'unexpected'] }])(
    'rejects invalid command arguments $args',
    ({ args }) => {
      expect(() =>
        execFileSync(process.execPath, [script, ...args], { input: secretKey, stdio: 'pipe' }),
      ).toThrow()
    },
  )
})
