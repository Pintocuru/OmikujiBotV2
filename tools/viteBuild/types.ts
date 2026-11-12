// tools/viteBuild/types.ts
import type { AccessLevelType } from '@shared/types'
import type { OmikujiDataType } from '@/types/OmikujiData/'

export type CopyFileItem = string | { from: string; to: string }

export interface ProjectParams {
  key: string
  title: string
  description: string
  banner: string
  tags: string[]
  boothId: string
  category: string
  series?: string
  licenseLabel: string
  extraFiles?: CopyFileItem[]
}

export interface TemplateConfig {
  name: string
  label: string
  boothURL: string
  readmeURL: string
  description: string
}

export interface JsonConfig {
  jsonPath: string
  jsonPathRoot: string
  assembleJsonData?: (data: OmikujiDataType, jsonPathRoot: string) => Promise<OmikujiDataType>
  generateAccessLevelData?: (data: OmikujiDataType, targetLevel?: AccessLevelType) => OmikujiDataType
  generateJsContent: (configData: string) => string
}

export interface ProjectConfig {
  key: string
  name: string
  version: string
  tags: string[]
  banner?: string
  packageRoot: string
  entryPoints: string | Record<string, string> | null
  template: TemplateConfig | null
  json?: JsonConfig
  licenseLabel: string
  filesToCopy: CopyFileItem[]
  licenseKey?: Record<AccessLevelType, string>
}

export interface CoreBuildTarget {
  project: string
}

export interface PackageBuildTarget {
  project: string
  accessLevel: AccessLevelType
  sourceProject: string
}

export interface SystemCommonData {
  alias: Record<string, string>
  author: string
  description: string
  generatorName: string
  generatorVersion: string
  dataVersion: number
}

export interface ResolvedCoreBuildConfig extends ProjectConfig {
  system: SystemCommonData
  outputFolderName: string
  entryPoints: string | Record<string, string>
}

export interface ResolvedPackageBuildConfig extends ProjectConfig {
  system: SystemCommonData
  targetAccessLevel: AccessLevelType
  outputFolderName: string
  sourceCorePath: string
}

