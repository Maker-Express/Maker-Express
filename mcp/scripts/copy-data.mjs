#!/usr/bin/env node
import { promises as fs } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const packageRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const srcDir = path.join(packageRoot, 'src', 'data')
const outDir = path.join(packageRoot, 'dist', 'data')

async function main() {
  await fs.mkdir(outDir, { recursive: true })
  const entries = await fs.readdir(srcDir, { withFileTypes: true })
  let copied = 0
  for (const entry of entries) {
    if (!entry.isFile() || !entry.name.endsWith('.json')) continue
    await fs.copyFile(path.join(srcDir, entry.name), path.join(outDir, entry.name))
    copied += 1
  }
  if (copied === 0) {
    throw new Error(`No registry JSON files copied from ${srcDir}`)
  }
  process.stdout.write(`Copied ${copied} registry JSON file(s) to ${path.relative(packageRoot, outDir)}.\n`)
}

main().catch((error) => {
  process.stderr.write(`${error instanceof Error ? error.stack : String(error)}\n`)
  process.exit(1)
})
