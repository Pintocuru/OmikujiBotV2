// tools/fileName/UpdateTsFiles.ts
import { promises as fs } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// モノレポ用
const TARGET_DIRS = ['src', 'tools', 'server', 'build']
const ROOT = path.resolve(__dirname, '../..')

// shared 用
// const TARGET_DIRS = ['shared']
// const ROOT = path.resolve(__dirname, '../../../..')

async function getAllTargetFiles(dir: string): Promise<string[]> {
  let entries
  try {
    entries = await fs.readdir(dir, { withFileTypes: true })
  } catch {
    return []
  }

  const results = await Promise.all(
    entries.map(async (entry) => {
      const fullPath = path.join(dir, entry.name)

      if (entry.isDirectory()) return getAllTargetFiles(fullPath)

      if (entry.isFile() && ((fullPath.endsWith('.ts') && !fullPath.endsWith('.d.ts')) || fullPath.endsWith('.vue'))) {
        return [fullPath]
      }

      return []
    })
  )

  return results.flat()
}

async function processFile(filePath: string) {
  const relativePath = path.relative(ROOT, filePath).replace(/\\/g, '/')
  const content = await fs.readFile(filePath, 'utf-8')
  const lines = content.split('\n')

  if (filePath.endsWith('.ts')) {
    if (lines[0]?.trim().startsWith('//')) lines.shift()
    lines.unshift(`// ${relativePath}`)
  } else if (filePath.endsWith('.vue')) {
    if (lines[0]?.trim().startsWith('<!--')) lines.shift()
    lines.unshift(`<!-- ${relativePath} -->`)
  }

  await fs.writeFile(filePath, lines.join('\n'), 'utf-8')
}

async function main() {
  const filesPerDir = await Promise.all(TARGET_DIRS.map((dir) => getAllTargetFiles(path.join(ROOT, dir))))
  const files = filesPerDir.flat()
  await Promise.all(files.map(processFile))
  console.log(`Processed ${files.length} files`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
