// tools/viteBuild/buildPackages.ts
import fs from 'fs/promises'
import path from 'path'
import type { CoreBuildTarget, PackageBuildTarget, ProjectConfig, SystemCommonData } from './types'
import { resolveCoreBuildConfigs, resolvePackageBuildConfigs } from './core/ConfigResolver'
import { executeCoreBuild, executePackageBuild } from './core/BuildExecutor'
import { buildZipFolders } from './utils/ZipBuilder'

interface BuildOptions {
  packageRoot: string
  projects: ProjectConfig[]
  coreTargets: CoreBuildTarget[]
  packageTargets: PackageBuildTarget[]
  system: SystemCommonData
}

export async function buildPackages(options: BuildOptions): Promise<void> {
  const { packageRoot, projects, coreTargets, packageTargets, system } = options
  if (coreTargets.length === 0 || packageTargets.length === 0) {
    throw new Error('[Build] FULL build requires at least one Core and one package target')
  }

  const projectMap = new Map(projects.map((project) => [project.key, project]))
  const coreConfigs = resolveCoreBuildConfigs(coreTargets, projectMap, system)
  const corePaths = new Map<string, string>()
  for (const config of coreConfigs) {
    corePaths.set(config.key, path.join(packageRoot, 'dist', config.outputFolderName))
  }
  const packageConfigs = resolvePackageBuildConfigs(packageTargets, projectMap, system, corePaths)

  const distRoot = path.join(packageRoot, 'dist')
  await fs.rm(distRoot, { recursive: true, force: true })
  await fs.mkdir(distRoot, { recursive: true })

  for (const config of coreConfigs) {
    const outputPath = await executeCoreBuild(config)
    corePaths.set(config.key, outputPath)
  }

  for (const config of packageConfigs) {
    await executePackageBuild(config)
  }

  await buildZipFolders(packageRoot)
}
