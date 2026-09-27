import { execFileSync } from 'node:child_process'
import { mkdtemp, rm } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { backup, DatabaseSync } from 'node:sqlite'
import { afterEach, describe, expect, it } from 'vitest'

const script = path.resolve('scripts/update-content.mjs')
const studySlug = 'the-psilocd-study-recruitment-is-now-open-now-closed'
const oldTitle = 'The PSILOCD Study – Recruitment open! [NOW CLOSED]'
const oldDescription =
  'The PSILOCD Study recruitment is now open! (Evaluating the effects of the 5-HT 2A agonist psilocybin on the neurocognitive and clinical correlates of compulsivity: a pharmacological-challenge feasibility study.)'
const databases: DatabaseSync[] = []
const directories: string[] = []

function runUpdate(databaseUrl: string) {
  execFileSync(process.execPath, ['--experimental-sqlite', script], {
    env: { ...process.env, DATABASE_URL: databaseUrl },
    stdio: 'pipe',
  })
}

async function fixture() {
  const databaseUrl = process.env.DATABASE_URL ?? ''
  if (!databaseUrl.startsWith('file:')) throw new Error('A seeded SQLite database is required.')
  const directory = await mkdtemp(path.join(os.tmpdir(), 'orchard-content-updates-'))
  directories.push(directory)
  const filename = path.join(directory, 'content.db')
  const source = new DatabaseSync(path.resolve(databaseUrl.slice(5)), { readOnly: true })
  try {
    await backup(source, filename)
  } finally {
    source.close()
  }
  const database = new DatabaseSync(filename)
  databases.push(database)
  database.prepare('DELETE FROM people WHERE slug = ?').run('katherine-selby')
  const person = database
    .prepare('INSERT INTO people (name, slug, "group") VALUES (?, ?, ?)')
    .run('Katherine Selby', 'katherine-selby', 'team')
  const lock = database.prepare('INSERT INTO payload_locked_documents DEFAULT VALUES').run()
  database
    .prepare(
      'INSERT INTO payload_locked_documents_rels (parent_id, path, people_id) VALUES (?, ?, ?)',
    )
    .run(lock.lastInsertRowid, 'document', person.lastInsertRowid)
  const body = JSON.stringify({
    root: {
      type: 'root',
      children: [
        { type: 'paragraph', children: [{ type: 'text', text: oldDescription }] },
        { type: 'paragraph', children: [{ type: 'text', text: 'Editor research notes.' }] },
      ],
    },
  })
  database
    .prepare(
      'UPDATE studies SET title = ?, excerpt = ?, meta_description = ?, body = ? WHERE slug = ?',
    )
    .run(oldTitle, oldDescription, oldDescription, body, studySlug)
  return { database, databaseUrl: `file:${filename}`, personId: person.lastInsertRowid }
}

afterEach(async () => {
  for (const database of databases.splice(0)) database.close()
  await Promise.all(directories.splice(0).map((directory) => rm(directory, { recursive: true })))
})

describe('content update command', () => {
  it('updates imported content and preserves other records and study details', async () => {
    const { database, databaseUrl, personId } = await fixture()
    const otherPerson = database
      .prepare('SELECT * FROM people WHERE slug != ? LIMIT 1')
      .get('katherine-selby')
    const post = database.prepare('SELECT * FROM posts ORDER BY id LIMIT 1').get()

    runUpdate(databaseUrl)

    expect(
      database.prepare('SELECT id FROM people WHERE slug = ?').get('katherine-selby'),
    ).toBeUndefined()
    expect(
      database
        .prepare('SELECT id FROM payload_locked_documents_rels WHERE people_id = ?')
        .get(personId),
    ).toBeUndefined()
    expect(
      database.prepare('SELECT * FROM people WHERE slug != ? LIMIT 1').get('katherine-selby'),
    ).toEqual(otherPerson)
    expect(database.prepare('SELECT * FROM posts ORDER BY id LIMIT 1').get()).toEqual(post)
    const study = database.prepare('SELECT * FROM studies WHERE slug = ?').get(studySlug)
    expect(study).toMatchObject({
      title: 'The PSILOCD Study – Completed',
      meta_description:
        'The PSILOCD Study investigating psilocybin for OCD is complete and is no longer recruiting participants.',
    })
    if (!study || typeof study.body !== 'string') throw new Error('Study body is missing.')
    const body = JSON.parse(study.body)
    expect(body.root.children[0].children[0].text).toContain('is no longer recruiting participants')
    expect(body.root.children[1].children[0].text).toBe('Editor research notes.')
    expect(study.excerpt).toBe(body.root.children[0].children[0].text)
  })

  it('can be repeated without changing already updated records', async () => {
    const { database, databaseUrl } = await fixture()
    runUpdate(databaseUrl)
    const studies = database.prepare('SELECT * FROM studies ORDER BY id').all()
    const people = database.prepare('SELECT * FROM people ORDER BY id').all()

    runUpdate(databaseUrl)

    expect(database.prepare('SELECT * FROM studies ORDER BY id').all()).toEqual(studies)
    expect(database.prepare('SELECT * FROM people ORDER BY id').all()).toEqual(people)
  })

  it('preserves editor changes to the study fields', async () => {
    const { database, databaseUrl } = await fixture()
    const body = JSON.stringify({
      root: {
        children: [
          {
            type: 'paragraph',
            children: [{ type: 'text', text: 'Updated study details from the research team.' }],
          },
        ],
      },
    })
    database
      .prepare(
        'UPDATE studies SET title = ?, excerpt = ?, meta_description = ?, body = ? WHERE slug = ?',
      )
      .run('Editor title', 'Editor excerpt', 'Editor description', body, studySlug)
    const study = database.prepare('SELECT * FROM studies WHERE slug = ?').get(studySlug)

    runUpdate(databaseUrl)

    expect(database.prepare('SELECT * FROM studies WHERE slug = ?').get(studySlug)).toEqual(study)
  })

  it('leaves unrelated content unchanged when the target records are absent', async () => {
    const { database, databaseUrl } = await fixture()
    database.prepare('DELETE FROM people WHERE slug = ?').run('katherine-selby')
    database.prepare('DELETE FROM studies WHERE slug = ?').run(studySlug)
    const studies = database.prepare('SELECT * FROM studies ORDER BY id').all()
    const people = database.prepare('SELECT * FROM people ORDER BY id').all()

    runUpdate(databaseUrl)

    expect(database.prepare('SELECT * FROM studies ORDER BY id').all()).toEqual(studies)
    expect(database.prepare('SELECT * FROM people ORDER BY id').all()).toEqual(people)
  })

  it.each(['', 'https://example.com/database', 'not-a-database-url'])(
    'fails for unsupported database configuration: %s',
    (databaseUrl) => {
      expect(() => runUpdate(databaseUrl)).toThrow()
    },
  )

  it('fails when the local database does not exist', async () => {
    const directory = await mkdtemp(path.join(os.tmpdir(), 'orchard-content-updates-'))
    directories.push(directory)
    expect(() => runUpdate(`file:${path.join(directory, 'missing.db')}`)).toThrow()
  })
})
