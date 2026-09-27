import { statSync } from 'node:fs'
import path from 'node:path'
import { DatabaseSync } from 'node:sqlite'

const databaseUrl = process.env.DATABASE_URL ?? ''
if (!databaseUrl.startsWith('file:') || databaseUrl.length === 5) {
  throw new Error('DATABASE_URL must point to an existing local SQLite file.')
}

const databasePath = path.resolve(databaseUrl.slice(5))
if (!statSync(databasePath).isFile()) {
  throw new Error('DATABASE_URL must point to an existing local SQLite file.')
}

const studySlug = 'the-psilocd-study-recruitment-is-now-open-now-closed'
const previousDescription =
  'The PSILOCD Study recruitment is now open! (Evaluating the effects of the 5-HT 2A agonist psilocybin on the neurocognitive and clinical correlates of compulsivity: a pharmacological-challenge feasibility study.)'
const description =
  'The PSILOCD Study investigating psilocybin for OCD is complete and is no longer recruiting participants.'
const opening = `${description} The information below describes the completed study and is retained for reference.`

const database = new DatabaseSync(databasePath)
try {
  database.exec('PRAGMA foreign_keys = ON; PRAGMA busy_timeout = 5000; BEGIN IMMEDIATE')
  try {
    database.prepare('DELETE FROM people WHERE slug = ?').run('katherine-selby')

    for (const [column, previous, updated] of [
      [
        'title',
        'The PSILOCD Study – Recruitment open! [NOW CLOSED]',
        'The PSILOCD Study – Completed',
      ],
      ['meta_description', previousDescription, description],
      ['excerpt', previousDescription, opening],
    ]) {
      database
        .prepare(
          `
        UPDATE studies SET ${column} = ?, updated_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now')
        WHERE slug = ? AND ${column} = ?
      `,
        )
        .run(updated, studySlug, previous)
    }

    database
      .prepare(
        `
      UPDATE studies
      SET body = json_set(body, '$.root.children[0].children[0].text', ?),
          updated_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now')
      WHERE slug = ?
        AND json_extract(body, '$.root.children[0].type') = 'paragraph'
        AND json_extract(body, '$.root.children[0].children[0].type') = 'text'
        AND json_extract(body, '$.root.children[0].children[0].text') = ?
    `,
      )
      .run(opening, studySlug, previousDescription)

    database.exec('COMMIT')
  } catch (error) {
    database.exec('ROLLBACK')
    throw error
  }
} finally {
  database.close()
}

console.log('Content updates applied.')
