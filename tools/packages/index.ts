// tools/packages/index.ts
import { CoreBuildTarget, PackageBuildTarget, ProjectConfig } from '@shared/utils/webpackBuild/BuildTypes'
import OmikujiBot from './core'
import Sesupin from './sesupin'
import Full from './full'
import Solo from './solo'
import Petit from './petit'

/**
 * コアビルド設定リスト
 * エディターを更新したら必ずビルドする基盤部分
 */
export const coreTargets: CoreBuildTarget[] = [
  { project: 'OmikujiBot' }, // MainGenerator + ConfigMaker
]

const packageGroups = [Sesupin, Full, Solo, Petit]
const packages = packageGroups.flat()

export function getAllProjects(packageRoot: string): ProjectConfig[] {
  return [...OmikujiBot.flatMap((p) => p(packageRoot)), ...packages.flatMap((p) => p.getProjects(packageRoot))]
}

export const packageTargets: PackageBuildTarget[] = packages.flatMap((p) => p.buildTargets)
