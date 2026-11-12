// tools/viteBuild/core/BuildExecutor.ts
import path from 'path'
import type { ResolvedCoreBuildConfig, ResolvedPackageBuildConfig } from '../types'
import { cleanOutputDir, copyDirectoryRecursive, copyFiles } from '../utils/FileCopier'
import { runViteCore } from './ViteRunner'
import { processPostBuild } from '../processors/PostBuildProcessor'

export async function executeCoreBuild(config: ResolvedCoreBuildConfig): Promise<string> {
  const outputPath = await cleanOutputDir(config.packageRoot, config.outputFolderName)
  await runViteCore(config, config.outputFolderName)
  if (config.filesToCopy.length > 0) {
    await copyFiles(config.filesToCopy, config.packageRoot, config.outputFolderName)
  }
  return outputPath
}

export async function executePackageBuild(config: ResolvedPackageBuildConfig): Promise<void> {
  const outputPath = await cleanOutputDir(config.packageRoot, config.outputFolderName)
  await copyDirectoryRecursive(config.sourceCorePath, outputPath)

  if (config.filesToCopy.length > 0) {
    await copyFiles(config.filesToCopy, config.packageRoot, config.outputFolderName)
  }

  await processPostBuild(config, outputPath)
}
