// tools/viteBuild/utils/ZipBuilder.ts
import fs from 'fs'
import path from 'path'
import archiver from 'archiver'

export async function buildZipFolders(packageRoot: string): Promise<void> {
  const distRoot = path.resolve(packageRoot, 'dist')
  const zipRoot = path.join(distRoot, 'distZipped')
  if (!fs.existsSync(distRoot)) return

  fs.mkdirSync(zipRoot, { recursive: true })
  const folders = fs.readdirSync(distRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && entry.name !== 'distZipped')
    .map((entry) => entry.name)

  for (const folder of folders) {
    await zipFolder(path.join(distRoot, folder), path.join(zipRoot, `${folder}.zip`))
  }
}

function zipFolder(sourceDir: string, outputPath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const output = fs.createWriteStream(outputPath)
    const archive = archiver('zip', { zlib: { level: 9 } })
    output.on('close', resolve)
    output.on('error', reject)
    archive.on('error', reject)
    archive.pipe(output)
    archive.directory(sourceDir, false)
    void archive.finalize()
  })
}
