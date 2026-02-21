// tools/UpdateTsFiles.ts
import { promises as fs } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// tools 配下にある前提
const ROOT = path.resolve(__dirname, '../src')

async function getAllTargetFiles(dir: string): Promise<string[]> {
  const entries = await fs.readdir(dir, { withFileTypes: true })

  const results = await Promise.all(
    entries.map(async (entry) => {
      const fullPath = path.join(dir, entry.name)

      if (entry.isDirectory()) {
        return getAllTargetFiles(fullPath)
      }

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
    if (lines[0]?.trim().startsWith('//')) {
      lines.shift()
    }
    lines.unshift(`// src/${relativePath}`)
  }

  if (filePath.endsWith('.vue')) {
    if (lines[0]?.trim().startsWith('<!--')) {
      lines.shift()
    }
    lines.unshift(`<!-- src/${relativePath} -->`)
  }

  await fs.writeFile(filePath, lines.join('\n'), 'utf-8')
}

async function main() {
  const files = await getAllTargetFiles(ROOT)
  await Promise.all(files.map(processFile))
  console.log(`Processed ${files.length} files`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
