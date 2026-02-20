// tools\UpdateTsFiles.ts
import { promises as fs } from 'fs'
import path from 'path'

const ROOT = path.resolve('root/src')

async function getAllTsFiles(dir: string): Promise<string[]> {
  const entries = await fs.readdir(dir, { withFileTypes: true })
  const files = await Promise.all(
    entries.map(async (entry) => {
      const fullPath = path.join(dir, entry.name)

      if (entry.isDirectory()) {
        return getAllTsFiles(fullPath)
      }

      if (entry.isFile() && fullPath.endsWith('.ts')) {
        return [fullPath]
      }

      return []
    })
  )

  return files.flat()
}

async function processFile(filePath: string) {
  const relativePath = path.relative(ROOT, filePath).replace(/\\/g, '/')
  const content = await fs.readFile(filePath, 'utf-8')

  const lines = content.split('\n')

  // 1行目が // コメントなら削除
  if (lines[0]?.trim().startsWith('//')) {
    lines.shift()
  }

  // 先頭に相対パスを追加
  lines.unshift(`// ${relativePath}`)

  await fs.writeFile(filePath, lines.join('\n'), 'utf-8')
}

async function main() {
  const files = await getAllTsFiles(ROOT)

  await Promise.all(files.map(processFile))

  console.log(`Processed ${files.length} files`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
