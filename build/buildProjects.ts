// build/buildProjects.ts
import { CoreBuildTarget, PackageBuildTarget } from '@shared/utils/webpackBuild/BuildTypes'
import OmikujiBot from './core'
import Common from './common'
import set2025Q4 from './2025-Q4'
import set2026Q1 from './2026-Q1'
import set2026Q2 from './2026-Q2'

/**
 * コアビルド設定リスト
 * エディターを更新したら必ずビルドする基盤部分
 */
export const coreTargets: CoreBuildTarget[] = [
  { project: 'OmikujiBot' }, // MainGenerator + ConfigMaker
]

const packages = [OmikujiBot, Common, set2025Q4, set2026Q1, set2026Q2].flat()

export function getAllProjects(packageRoot: string) {
  return packages.flatMap((p) => p.getProjects(packageRoot))
}

export const packageTargets: PackageBuildTarget[] = packages.flatMap((p) => p.buildTargets)
