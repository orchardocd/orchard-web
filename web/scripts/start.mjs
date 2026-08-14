import { spawn } from 'node:child_process'
import { cp, rm, symlink } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const app = path.join(root, '.next', 'standalone')
const uploads = ['media', 'documents', 'videos']

async function stage() {
  await cp(path.join(root, 'public'), path.join(app, 'public'), { recursive: true })
  await cp(path.join(root, '.next', 'static'), path.join(app, '.next', 'static'), {
    recursive: true,
  })
  for (const dir of uploads) {
    const link = path.join(app, dir)
    await rm(link, { recursive: true, force: true })
    await symlink(path.join(root, dir), link)
  }
}

function databaseUrl() {
  const url = process.env.DATABASE_URL ?? ''
  const file = url.startsWith('file:') ? url.slice('file:'.length) : ''
  if (!file || path.isAbsolute(file)) return url
  return `file:${path.resolve(root, file)}`
}

await stage()

const server = spawn(process.execPath, [path.join(app, 'server.js')], {
  stdio: 'inherit',
  env: { ...process.env, DATABASE_URL: databaseUrl() },
})

for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, () => server.kill(signal))
}

server.on('exit', (code, signal) => {
  if (signal) process.kill(process.pid, signal)
  else process.exit(code ?? 0)
})
