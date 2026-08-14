/**
 * What a drawing looks like, as a number a machine can compare.
 *
 * The old site kept two cuts of most spot illustrations, one plain and one with the brand
 * dashes scattered around it, so the same drawing arrives under two names, two file sizes
 * and two framings. A fingerprint therefore ignores the frame: it finds the largest solid
 * shape a picture draws, crops to that shape, and samples the grey inside it. The crop is
 * only ever close, never exact, because a cut can carry a drop shadow or a stray mark the
 * other one lacks, so a picture also carries the same samples taken at small shifts and
 * scales and two pictures are read at their best alignment. Two cuts of one drawing land on
 * the same numbers; two different drawings do not.
 *
 * Photographs are left out. A picture is read at its own proportions, never letterboxed into
 * a square, so a photograph shows nothing through and there is no shape to find. Comparing
 * them this way would call every portrait the same picture.
 *
 * Usage: node tools/fingerprint.mjs <directory>   (prints the pairs that are one drawing)
 */

import fs from 'node:fs/promises'
import path from 'node:path'
import { createRequire } from 'node:module'

const require = createRequire(path.join(import.meta.dirname, '../web/package.json'))
const sharp = require('sharp')

/** Below this two pictures are different drawings; at or above it they are two cuts of one. */
export const ALIKE = 0.87

const LONG = 256 // the long side every picture is read at
const GRID = 48 // samples taken across the shape
const INK = 40 // alpha above this counts as drawn
const CLEAR = 0.04 // a drawing shows this much of its frame through
const FLAT = 6 // a shape with less variation than this says nothing
const SHIFTS = [-0.05, 0, 0.05] // how far off centre a cut may sit
const SCALES = [0.93, 1, 1.07] // how much wider or tighter a cut may be

function largestShape(alpha, width, height) {
  const seen = new Uint8Array(width * height)
  let best = []
  for (let start = 0; start < width * height; start += 1) {
    if (alpha[start] <= INK || seen[start]) continue
    const queue = [start]
    const cells = []
    seen[start] = 1
    while (queue.length) {
      const cur = queue.pop()
      cells.push(cur)
      const y = Math.floor(cur / width)
      const x = cur % width
      for (let dy = -1; dy <= 1; dy += 1) {
        for (let dx = -1; dx <= 1; dx += 1) {
          const ny = y + dy
          const nx = x + dx
          if (ny < 0 || nx < 0 || ny >= height || nx >= width) continue
          const next = ny * width + nx
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

function samples(grey, frame, box, shiftX, shiftY, scale) {
  const centreX = box.left + box.width / 2 + shiftX * box.width
  const centreY = box.top + box.height / 2 + shiftY * box.height
  const width = box.width * scale
  const height = box.height * scale
  const taken = []
  for (let gy = 0; gy < GRID; gy += 1) {
    for (let gx = 0; gx < GRID; gx += 1) {
      const y = Math.round(centreY - height / 2 + ((gy + 0.5) * height) / GRID)
      const x = Math.round(centreX - width / 2 + ((gx + 0.5) * width) / GRID)
      const row = Math.min(Math.max(y, 0), frame.height - 1)
      const column = Math.min(Math.max(x, 0), frame.width - 1)
      taken.push(grey[row * frame.width + column])
    }
  }
  const mean = taken.reduce((sum, value) => sum + value, 0) / taken.length
  const spread = Math.sqrt(
    taken.reduce((sum, value) => sum + (value - mean) ** 2, 0) / taken.length,
  )
  if (spread < FLAT) return null
  return Float32Array.from(taken, (value) => (value - mean) / spread)
}

export async function signature(file) {
  const { data, info } = await sharp(file, { density: 200 })
    .ensureAlpha()
    .resize(LONG, LONG, { fit: 'inside' })
    .raw()
    .toBuffer({ resolveWithObject: true })
  const frame = { width: info.width, height: info.height }
  const alpha = new Uint8Array(frame.width * frame.height)
  let drawn = 0
  for (let i = 0; i < alpha.length; i += 1) {
    alpha[i] = data[i * 4 + 3]
    if (alpha[i] > INK) drawn += 1
  }
  if (1 - drawn / alpha.length < CLEAR) return null

  const cells = largestShape(alpha, frame.width, frame.height)
  if (cells.length < 240) return null
  let top = frame.height
  let bottom = 0
  let left = frame.width
  let right = 0
  for (const cell of cells) {
    const y = Math.floor(cell / frame.width)
    const x = cell % frame.width
    if (y < top) top = y
    if (y > bottom) bottom = y
    if (x < left) left = x
    if (x > right) right = x
  }
  const box = { left, top, width: right - left + 1, height: bottom - top + 1 }
  if (box.width < 16 || box.height < 16) return null

  const grey = await sharp(file, { density: 200 })
    .resize(LONG, LONG, { fit: 'inside' })
    .flatten({ background: '#ffffff' })
    .greyscale()
    .raw()
    .toBuffer()

  const centred = samples(grey, frame, box, 0, 0, 1)
  if (!centred) return null
  const alignments = []
  for (const shiftX of SHIFTS) {
    for (const shiftY of SHIFTS) {
      for (const scale of SCALES) {
        const taken = samples(grey, frame, box, shiftX, shiftY, scale)
        if (taken) alignments.push(taken)
      }
    }
  }
  return { centred, alignments }
}

function agreement(left, right) {
  let total = 0
  for (let i = 0; i < left.length; i += 1) total += left[i] * right[i]
  return total / left.length
}

/** How alike two drawings are, from -1 to 1, read at their best alignment. */
export function likeness(left, right) {
  let best = agreement(left.centred, right.centred)
  for (const alignment of right.alignments) {
    const score = agreement(left.centred, alignment)
    if (score > best) best = score
  }
  return best
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
  const marks = await signatures(process.argv[2])
  const names = Object.keys(marks).filter((name) => marks[name])
  for (let i = 0; i < names.length; i += 1) {
    for (let j = i + 1; j < names.length; j += 1) {
      const score = likeness(marks[names[i]], marks[names[j]])
      if (score >= ALIKE) console.log(score.toFixed(4), names[i], names[j])
    }
  }
}
