// tools/viteBuild/utils/FileCopier.ts
import fs from 'fs/promises'
import path from 'path'
import type { CopyFileItem } from '../types'

export async function copyFiles(files: CopyFileItem[], packageRoot: string, outputSubDir: string): Promise<void> {
  const outputRoot = path.join(packageRoot, 'dist', outputSubDir)

  for (const item of files) {
    const from = typeof item === 'string' ? item : item.from
    const to = typeof item === 'string' ? path.basename(item) : item.to
    const source = path.resolve(packageRoot, from)
    const destination = path.resolve(outputRoot, to)

    await fs.mkdir(path.dirname(destination), { recursive: true })
    await fs.cp(source, destination, { recursive: true, force: true })
  }
}

export async function copyDirectoryRecursive(source: string, destination: string): Promise<void> {
  await fs.mkdir(destination, { recursive: true })
  await fs.cp(source, destination, { recursive: true, force: true })
}

export async function cleanOutputDir(packageRoot: string, outputSubDir: string): Promise<string> {
  const outputPath = path.join(packageRoot, 'dist', outputSubDir)
  await fs.rm(outputPath, { recursive: true, force: true })
  await fs.mkdir(outputPath, { recursive: true })
  return outputPath
}
