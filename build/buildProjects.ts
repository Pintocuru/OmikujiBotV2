// build/buildProjects.ts
import type { CoreBuildTarget, PackageBuildTarget } from '../tools/viteBuild/types'
import OmikujiBot from './core'
import Common from './common'
import set2026Q2 from './2026-Q2'

/**
 * コアビルド設定リスト
 * エディターを更新したら必ずビルドする基盤部分
 */
export const coreTargets: CoreBuildTarget[] = [{ project: 'OmikujiBot' }]

// 現在販売・配布対象として登録されているパッケージ群のみを解決する。
// 未発売・停止中の定義は build index に残すが、ビルド時には評価しない。
const activePackages = [Common, set2026Q2].flat()

export function getAllProjects(packageRoot: string) {
  return [...OmikujiBot.getProjects(packageRoot), ...activePackages.flatMap((item) => item.getProjects(packageRoot))]
}

export const packageTargets: PackageBuildTarget[] = activePackages.flatMap((item) => item.buildTargets)
