// tools/viteBuild/core/ConfigResolver.ts
import fs from 'fs'
import type {
  CoreBuildTarget,
  PackageBuildTarget,
  ProjectConfig,
  ResolvedCoreBuildConfig,
  ResolvedPackageBuildConfig,
  SystemCommonData,
} from '../types'

const sanitizeName = (value: string) => value.replace(/[<>:"/\\|?*]/g, '_')

export function resolveCoreBuildConfigs(
  targets: CoreBuildTarget[],
  projects: Map<string, ProjectConfig>,
  system: SystemCommonData
): ResolvedCoreBuildConfig[] {
  return targets.map(({ project }) => {
    const config = projects.get(project)
    if (!config) throw new Error(`[Build] Core project not found: ${project}`)
    if (!config.entryPoints) throw new Error(`[Build] Core entryPoints are missing: ${project}`)
    const entries = typeof config.entryPoints === 'string' ? [config.entryPoints] : Object.values(config.entryPoints)
    for (const entry of entries) {
      if (!fs.existsSync(entry)) throw new Error(`[Build] Core entry not found: ${entry}`)
    }

    return {
      ...config,
      system,
      entryPoints: config.entryPoints,
      outputFolderName: `${sanitizeName(config.key)}_core_${sanitizeName(config.version)}`,
    }
  })
}

export function resolvePackageBuildConfigs(
  targets: PackageBuildTarget[],
  projects: Map<string, ProjectConfig>,
  system: SystemCommonData,
  coreOutputPaths: Map<string, string>
): ResolvedPackageBuildConfig[] {
  const resolved = targets.map((target) => {
    const config = projects.get(target.project)
    if (!config) throw new Error(`[Build] Package project not found: ${target.project}`)
    if (!config.json) throw new Error(`[Build] FULL package requires JSON config: ${target.project}`)
    if (!config.template) throw new Error(`[Build] FULL package requires template metadata: ${target.project}`)

    const sourceCorePath = coreOutputPaths.get(target.sourceProject)
    if (!sourceCorePath) {
      throw new Error(`[Build] Core output is not registered for ${target.project}: ${target.sourceProject}`)
    }

    const accessSuffix = target.accessLevel === 'basic' ? '' : `${target.accessLevel}_`
    const outputFolderName = `${sanitizeName(config.key)}_${accessSuffix}${sanitizeName(config.version)}`

    return {
      ...config,
      system,
      targetAccessLevel: target.accessLevel,
      sourceCorePath,
      outputFolderName,
    }
  })

  const outputs = new Set<string>()
  for (const config of resolved) {
    if (outputs.has(config.outputFolderName)) {
      throw new Error(`[Build] Duplicate output directory: ${config.outputFolderName}`)
    }
    outputs.add(config.outputFolderName)
  }

  return resolved
}

