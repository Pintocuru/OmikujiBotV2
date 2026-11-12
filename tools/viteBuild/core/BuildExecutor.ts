// tools/viteBuild/core/BuildExecutor.ts
import fs from 'fs'
import path from 'path'
import type { ResolvedCoreBuildConfig, ResolvedPackageBuildConfig } from '../types'
import { cleanOutputDir, copyDirectoryRecursive, copyFiles } from '../utils/FileCopier'
import { runViteCore } from './ViteRunner'
import { processPostBuild } from '../processors/PostBuildProcessor'

const CORE_REQUIRED_FILES = [
  'index.html',
  'ConfigMaker.html',
  'script.js',
  'scripts/MainGenerator.js',
  'scripts/ConfigMaker.js',
  'scripts/MainGenerator.css',
  'scripts/ConfigMaker.css',
]

function assertFilesExist(outputPath: string, files: string[], label: string): void {
  for (const file of files) {
    const filePath = path.join(outputPath, file)
    if (!fs.existsSync(filePath)) {
      throw new Error(`[Build] ${label} output is missing: ${filePath}`)
    }
  }
}

export async function executeCoreBuild(config: ResolvedCoreBuildConfig): Promise<string> {
  const outputPath = await cleanOutputDir(config.packageRoot, config.outputFolderName)
  await runViteCore(config, config.outputFolderName)
  if (config.filesToCopy.length > 0) {
    await copyFiles(config.filesToCopy, config.packageRoot, config.outputFolderName)
  }
  assertFilesExist(outputPath, CORE_REQUIRED_FILES, 'Core')
  return outputPath
}

export async function executePackageBuild(config: ResolvedPackageBuildConfig): Promise<void> {
  const outputPath = await cleanOutputDir(config.packageRoot, config.outputFolderName)
  await copyDirectoryRecursive(config.sourceCorePath, outputPath)

  if (config.filesToCopy.length > 0) {
    await copyFiles(config.filesToCopy, config.packageRoot, config.outputFolderName)
  }

  await processPostBuild(config, outputPath)
  assertFilesExist(
    outputPath,
    [...CORE_REQUIRED_FILES, 'omikujiData.js', 'readme.txt', 'template.json', 'thumb.gif'],
    'FULL package'
  )
}
