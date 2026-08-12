/**
 * What a drawing looks like, as a number a machine can compare.
 *
 * The old site kept two cuts of most spot illustrations, one plain and one with the brand
 * dashes scattered around it, so the same drawing arrives under two names and two file sizes.
 * A fingerprint therefore ignores the frame: it finds the largest solid shape a picture draws,
 * crops to that shape, and samples the grey inside it. Two cuts of one drawing land on the
 * same numbers; two different drawings do not.
 *
 * Photographs are left out. They fill their frame, so there is no shape to find, and comparing
 * them this way would call every portrait the same picture.
 *
 * Usage: node tools/fingerprint.mjs <directory>   (prints {name: signature | null})
 */

import fs from 'node:fs/promises'
import path from 'node:path'
import { createRequire } from 'node:module'

const require = createRequire(path.join(import.meta.dirname, '../web/package.json'))
const sharp = require('sharp')

const FRAME = 128 // the square every picture is read in
const GRID = 24 // samples taken across the shape
const INK = 40 // alpha above this counts as drawn
const CLEAR = 0.04 // a drawing shows this much of its frame through
const FLAT = 6 // a shape with less variation than this says nothing

function largestShape(alpha) {
  const seen = new Uint8Array(FRAME * FRAME)
  let best = []
  for (let start = 0; start < FRAME * FRAME; start += 1) {
    if (alpha[start] <= INK || seen[start]) continue
    const queue = [start]
    const cells = []
    seen[start] = 1
    while (queue.length) {
      const cur = queue.pop()
      cells.push(cur)
      const y = Math.floor(cur / FRAME)
      const x = cur % FRAME
      for (let dy = -1; dy <= 1; dy += 1) {
        for (let dx = -1; dx <= 1; dx += 1) {
          const ny = y + dy
          const nx = x + dx
          if (ny < 0 || nx < 0 || ny >= FRAME || nx >= FRAME) continue
          const next = ny * FRAME + nx
          if (alpha[next] > INK && !seen[next]) {
            seen[next] = 1
            queue.push(next)
          }
        }
      }
    }
    if (cells.length > best.length) best = cells
  }
  return best
}

export async function signature(file) {
  const image = sharp(file, { density: 160 })
  const { data } = await image
    .ensureAlpha()
    .resize(FRAME, FRAME, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .raw()
    .toBuffer({ resolveWithObject: true })

  const alpha = new Uint8Array(FRAME * FRAME)
  let drawn = 0
  for (let i = 0; i < FRAME * FRAME; i += 1) {
    alpha[i] = data[i * 4 + 3]
    if (alpha[i] > INK) drawn += 1
  }
  if (1 - drawn / alpha.length < CLEAR) return null

  const cells = largestShape(alpha)
  if (cells.length < 60) return null
  let top = FRAME
  let bottom = 0
  let left = FRAME
  let right = 0
  for (const cell of cells) {
    const y = Math.floor(cell / FRAME)
    const x = cell % FRAME
    if (y < top) top = y
    if (y > bottom) bottom = y
    if (x < left) left = x
    if (x > right) right = x
  }
  const height = bottom - top + 1
  const width = right - left + 1
  if (height < 8 || width < 8) return null

  const grey = await sharp(file, { density: 160 })
    .resize(FRAME, FRAME, { fit: 'contain', background: '#ffffff' })
    .flatten({ background: '#ffffff' })
    .greyscale()
    .raw()
    .toBuffer()

  const samples = []
  for (let gy = 0; gy < GRID; gy += 1) {
    for (let gx = 0; gx < GRID; gx += 1) {
      const y = Math.min(top + Math.floor(((gy + 0.5) * height) / GRID), FRAME - 1)
      const x = Math.min(left + Math.floor(((gx + 0.5) * width) / GRID), FRAME - 1)
      samples.push(grey[y * FRAME + x])
    }
  }
  const mean = samples.reduce((sum, value) => sum + value, 0) / samples.length
  const spread = Math.sqrt(
    samples.reduce((sum, value) => sum + (value - mean) ** 2, 0) / samples.length,
  )
  if (spread < FLAT) return null
  return samples.map((value) => Number(((value - mean) / spread).toFixed(4)))
}

/** How alike two drawings are, from -1 to 1. */
export function likeness(left, right) {
  let total = 0
  for (let i = 0; i < left.length; i += 1) total += left[i] * right[i]
  return total / left.length
}

export async function signatures(directory) {
  const marks = {}
  for (const name of (await fs.readdir(directory)).sort()) {
    try {
      marks[name] = await signature(path.join(directory, name))
    } catch {
      marks[name] = null
    }
  }
  return marks
}

if (process.argv[1] === import.meta.filename) {
  console.log(JSON.stringify(await signatures(process.argv[2])))
}
