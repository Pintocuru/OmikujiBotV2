// tools/packages/index.ts
import { CoreBuildTarget, PackageBuildTarget, ProjectConfig } from '@shared/utils/webpackBuild/BuildTypes'
import { getCoreProjects } from './core'
import SesupinProjects from './sesupin'
import FullProjects from './full'
import SoloProjects from './solo'
import PetitProjects from './petit'

/**
 * コアビルド設定リスト
 * エディターを更新したら必ずビルドする基盤部分
 */
export const coreTargets: CoreBuildTarget[] = [
  { project: 'OmikujiBot' }, // MainGenerator + ConfigMaker
  { project: 'OmikujiBotMain' }, // MainGenerator のみ
]

export function getAllProjects(packageRoot: string): ProjectConfig[] {
  return [
    ...getCoreProjects(packageRoot),
    ...SesupinProjects.projects(packageRoot),
    ...FullProjects.projects(packageRoot),
    ...SoloProjects.projects(packageRoot),
    ...PetitProjects.projects(packageRoot),
  ]
}

export const packageTargets: PackageBuildTarget[] = [
  ...SesupinProjects.targets,
  ...FullProjects.targets,
  ...SoloProjects.targets,
  ...PetitProjects.targets,
]
