import { execFile } from 'node:child_process'
import { createHash } from 'node:crypto'
import fs from 'node:fs/promises'
import path from 'node:path'
import { promisify } from 'node:util'
import sharp from 'sharp'

import { likeness, signatures } from '../../../tools/fingerprint.mjs'

// Below this two pictures are different drawings; at or above it they are two cuts of one.
const ALIKE = 0.87

const run = promisify(execFile)

const ROOT = path.resolve(import.meta.dirname, '../../..')
const contentPath = path.join(ROOT, 'web/src/seed/content.json')
const content = JSON.parse(await fs.readFile(contentPath, 'utf8'))
const dest = path.join(ROOT, 'web/src/seed/assets')
await fs.rm(dest, { recursive: true, force: true })

const MAX_WIDTH = 2000

const WHITE = /^(white|#fff|#ffffff)$/i

/**
 * The old site placed a few marks on a coloured band. On a white page they are invisible, so
 * an SVG whose every stroke and fill is white gets the brand green instead.
 */
function recolourWhiteOnlySvg(markup) {
  const colours = [...markup.matchAll(/(?:fill|stroke)="([^"]+)"/g)]
    .map((match) => match[1])
    .filter((value) => value.toLowerCase() !== 'none')
  if (colours.length === 0 || !colours.every((value) => WHITE.test(value))) return markup
  return markup.replace(/(fill|stroke)="(white|#fff|#ffffff)"/gi, '$1="#00655C"')
}

async function encodeImage(src, ext) {
  const original = await fs.readFile(src)
  if (ext === '.svg') {
    const recoloured = recolourWhiteOnlySvg(original.toString('utf8'))
    return { buffer: Buffer.from(recoloured, 'utf8'), ext }
  }
  const img = sharp(src, { failOn: 'none' })
  const meta = await img.metadata()
  const resize = meta.width && meta.width > MAX_WIDTH ? img.resize({ width: MAX_WIDTH }) : img
  const candidates = [{ buffer: original, ext }]
  if (meta.hasAlpha) {
    candidates.push({
      buffer: await resize.clone().png({ compressionLevel: 9, palette: true }).toBuffer(),
      ext: '.png',
    })
  } else {
    candidates.push({
      buffer: await resize.clone().jpeg({ quality: 82, mozjpeg: true }).toBuffer(),
      ext: '.jpg',
    })
  }
  return candidates.reduce((best, c) => (c.buffer.length < best.buffer.length ? c : best))
}

const seen = new Set()
let before = 0
let after = 0
// The old site uploaded the same artwork under several names. One file, one asset.
const byContent = new Map()
for (const kind of ['images', 'documents', 'videos']) {
  for (const item of content[kind]) {
    const src = path.join(ROOT, 'mirror', item.file)
    const stat = await fs.stat(src)
    before += stat.size
    const ext = path.extname(src).toLowerCase()
    let encoded
    if (kind === 'images') {
      encoded = await encodeImage(src, ext)
    } else if (kind === 'videos') {
      const tmp = path.join(dest, '.transcode.mp4')
      await fs.mkdir(dest, { recursive: true })
      await run('ffmpeg', ['-y', '-loglevel', 'error', '-i', src, '-vf',
        "scale='min(960,iw)':-2", '-c:v', 'libx264', '-preset', 'slower', '-crf', '32',
        '-c:a', 'aac', '-b:a', '80k', '-ac', '1', '-movflags', '+faststart', tmp])
      encoded = { buffer: await fs.readFile(tmp), ext: '.mp4' }
      await fs.rm(tmp, { force: true })
    } else {
      encoded = { buffer: await fs.readFile(src), ext }
    }
    const asset =
      item.id
        .replace(/^uploads\//, '')
        .replace(/\.[^.]+$/, '')
        .replace(/[^a-zA-Z0-9]+/g, '-')
        .replace(/^-|-$/g, '') + encoded.ext
    const fingerprint = createHash('sha256').update(encoded.buffer).digest('hex')
    const already = byContent.get(fingerprint)
    if (already) {
      item.asset = already
      continue
    }

    const out = path.join(dest, asset)
    await fs.mkdir(path.dirname(out), { recursive: true })
    if (seen.has(asset)) throw new Error(`Asset name collision: ${asset}`)
    seen.add(asset)
    await fs.writeFile(out, encoded.buffer)
    after += encoded.buffer.length
    item.asset = asset
    byContent.set(fingerprint, asset)
  }
}

// Two cuts of one drawing, plain and confetti, are one illustration.
const marks = await signatures(dest)
const canonical = new Map()
const collapsed = new Map()
for (const item of content.images) {
  if (collapsed.has(item.asset) || canonical.has(item.asset)) continue
  const mark = marks[item.asset]
  if (!mark) continue
  let match = null
  for (const [asset, other] of canonical) {
    if (likeness(mark, other) >= ALIKE) {
      match = asset
      break
    }
  }
  if (match) collapsed.set(item.asset, match)
  else canonical.set(item.asset, mark)
}
for (const item of content.images) {
  const instead = collapsed.get(item.asset)
  if (instead) item.asset = instead
}
for (const asset of collapsed.keys()) {
  await fs.rm(path.join(dest, asset), { force: true })
}
if (collapsed.size) console.log('drawings collapsed', collapsed.size)

await fs.writeFile(contentPath, JSON.stringify(content, null, 1))
console.log('before MB', (before / 1e6).toFixed(1), '-> after MB', (after / 1e6).toFixed(1))
