import fs from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const ROOT = path.resolve(import.meta.dirname, '../../..')
const contentPath = path.join(ROOT, 'web/src/seed/content.json')
const content = JSON.parse(await fs.readFile(contentPath, 'utf8'))
const dest = path.join(ROOT, 'web/src/seed/assets')
await fs.rm(dest, { recursive: true, force: true })

const MAX_WIDTH = 2000

async function encodeImage(src, ext) {
  const original = await fs.readFile(src)
  if (ext === '.svg') {
    return { buffer: original, ext }
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

let before = 0
let after = 0
for (const kind of ['images', 'documents']) {
  for (const item of content[kind]) {
    const src = path.join(ROOT, 'mirror', item.file)
    const stat = await fs.stat(src)
    before += stat.size
    const ext = path.extname(src).toLowerCase()
    const encoded =
      kind === 'images' ? await encodeImage(src, ext) : { buffer: await fs.readFile(src), ext }
    const asset = item.id.replace(/\.[^.]+$/, '') + encoded.ext
    const out = path.join(dest, asset)
    await fs.mkdir(path.dirname(out), { recursive: true })
    await fs.writeFile(out, encoded.buffer)
    after += encoded.buffer.length
    item.asset = asset
  }
}

await fs.writeFile(contentPath, JSON.stringify(content, null, 1))
console.log('before MB', (before / 1e6).toFixed(1), '-> after MB', (after / 1e6).toFixed(1))
