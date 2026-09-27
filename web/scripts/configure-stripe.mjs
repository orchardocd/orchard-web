import { constants } from 'node:fs'
import { lstat, mkdtemp, open, rename, rm } from 'node:fs/promises'
import path from 'node:path'
import { parseEnv } from 'node:util'

const ownedKeys = new Set(['STRIPE_SECRET_KEY', 'SITE_URL'])

function preserveSettings(source) {
  if (/\r(?!\n)/.test(source)) throw new Error('Unsupported environment file line endings.')
  const lines = source.match(/[^\n]*(?:\n|$)/g)?.filter(Boolean) ?? []
  const preserved = []

  for (let index = 0; index < lines.length; index += 1) {
    let record = lines[index]
    const assignment = /^[\t \uFEFF]*(?:export +)?([A-Za-z_][A-Za-z0-9_]*)[\t ]*=[\t ]*(.*)/.exec(
      record,
    )
    if (!assignment) {
      preserved.push(record)
      continue
    }

    const [, key, value] = assignment
    const firstLine = index
    const quote = value[0]
    if (quote === '"' || quote === "'" || quote === '`') {
      let remainder = value.slice(1)
      while (!remainder.includes(quote)) {
        index += 1
        if (index >= lines.length) throw new Error('Unterminated environment value.')
        record += lines[index]
        remainder += lines[index]
      }
      const ending = remainder.indexOf(quote)
      const suffix = remainder.slice(ending + 1).trim()
      if (remainder[ending - 1] === '\\' || (suffix && !suffix.startsWith('#'))) {
        throw new Error('Ambiguous quoted environment value.')
      }
    } else {
      while ((record.replace(/\r?\n$/, '').match(/\\+$/)?.[0].length ?? 0) % 2 === 1) {
        index += 1
        if (index >= lines.length) throw new Error('Unterminated environment continuation.')
        record += lines[index]
      }
    }

    if (ownedKeys.has(key)) {
      if (index !== firstLine) throw new Error('Managed environment values must use one line.')
    } else {
      preserved.push(record)
    }
  }

  return preserved.join('')
}

async function configure() {
  const [filename, siteUrl, ...extra] = process.argv.slice(2)
  if (!filename || !siteUrl || extra.length)
    throw new Error('Provide an environment file and origin.')

  const url = new URL(siteUrl)
  const local = ['localhost', '127.0.0.1', '[::1]'].includes(url.hostname)
  if (
    (url.protocol !== 'https:' && !(local && url.protocol === 'http:')) ||
    (siteUrl !== url.origin && siteUrl !== `${url.origin}/`)
  ) {
    throw new Error('Provide a canonical HTTPS site origin.')
  }

  let input = ''
  process.stdin.setEncoding('utf8')
  for await (const chunk of process.stdin) {
    input += chunk
    if (input.length > 4096) throw new Error('Invalid Stripe secret key.')
  }
  const secretKey = input.replace(/\r?\n$/, '')
  if (secretKey !== secretKey.trim() || !/^sk_(?:test|live)_[A-Za-z0-9]+$/.test(secretKey)) {
    throw new Error('Invalid Stripe secret key.')
  }

  const file = await open(filename, constants.O_RDONLY | constants.O_NOFOLLOW)
  let source
  let original
  try {
    original = await file.stat()
    if (!original.isFile() || original.uid !== process.getuid()) {
      throw new Error('The environment file must belong to the current service user.')
    }
    source = new TextDecoder('utf-8', { fatal: true, ignoreBOM: true }).decode(
      await file.readFile(),
    )
  } finally {
    await file.close()
  }

  let updated = preserveSettings(source)
  const newline = source.includes('\r\n') ? '\r\n' : '\n'
  if (updated && !updated.endsWith('\n')) updated += newline
  updated += `STRIPE_SECRET_KEY=${secretKey}${newline}SITE_URL=${url.origin}${newline}`

  const before = parseEnv(source)
  const after = parseEnv(updated)
  for (const key of new Set([...Object.keys(before), ...Object.keys(after)])) {
    if (!ownedKeys.has(key) && before[key] !== after[key]) {
      throw new Error('Updating this file would change unrelated environment settings.')
    }
  }
  if (after.STRIPE_SECRET_KEY !== secretKey || after.SITE_URL !== url.origin) {
    throw new Error('The environment file cannot be updated safely.')
  }

  const directory = await mkdtemp(path.join(path.dirname(filename), '.stripe-config-'))
  try {
    const temporary = path.join(directory, 'app.env')
    const replacement = await open(temporary, 'wx', 0o600)
    try {
      await replacement.writeFile(updated)
      await replacement.sync()
    } finally {
      await replacement.close()
    }
    const current = await lstat(filename)
    if (
      current.ino !== original.ino ||
      current.dev !== original.dev ||
      current.mtimeMs !== original.mtimeMs ||
      current.size !== original.size
    ) {
      throw new Error('The environment file changed during configuration.')
    }
    await rename(temporary, filename)
  } finally {
    await rm(directory, { recursive: true, force: true })
  }
}

try {
  await configure()
} catch {
  console.error('Stripe configuration failed.')
  process.exitCode = 1
}
