// tools/packages/index.ts
import { CoreBuildTarget, PackageBuildTarget, ProjectConfig } from '@shared/utils/webpackBuild/BuildTypes'
import OmikujiBot from './core'
import Common from './common'
import set2025Q4 from './2025-Q4'
import set2026Q1 from './2026-Q1'

/**
 * コアビルド設定リスト
 * エディターを更新したら必ずビルドする基盤部分
 */
export const coreTargets: CoreBuildTarget[] = [
  { project: 'OmikujiBot' }, // MainGenerator + ConfigMaker
]

const packageGroups = [Common, set2025Q4, set2026Q1]
const packages = packageGroups.flat()

export function getAllProjects(packageRoot: string): ProjectConfig[] {
  return [...OmikujiBot.flatMap((p) => p(packageRoot)), ...packages.flatMap((p) => p.getProjects(packageRoot))]
}

export const packageTargets: PackageBuildTarget[] = packages.flatMap((p) => p.buildTargets)
