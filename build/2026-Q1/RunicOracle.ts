// build/2026-Q1/RunicOracle.ts
import { createProject } from '../../tools/buildOptions/baseSettings'
import { PackageBuildTarget, ProjectConfig, ProjectParams } from '@shared/utils/webpackBuild/BuildTypes'

const PROJECT = {
  key: 'RunicOracle',
  title: 'ルーン占い',
  description: '24 個のルーンストーンで占う、気軽に使えるルーン占いジェネレーター',
  banner: '',
  tags: ['占い', 'ルーン占い'],
  boothId: '7919298',
  category: '2026-Q1',
  licenseLabel: '利用規約に従う',
  extraFiles: [],
} satisfies ProjectParams

// バリエーション定義
const COLOR_VARIANTS = [''] as const

// ビルドターゲット（adv を反映）
const buildTargets: PackageBuildTarget[] = [
  { project: 'RunicOracle', type: 'FULL', accessLevel: 'adv', sourceProject: 'OmikujiBot' },
  { project: 'RunicOracle', type: 'JSON', accessLevel: 'basic' },
]

// プロジェクト一覧
function getProjects(packageRoot: string): ProjectConfig[] {
  return COLOR_VARIANTS.map((color) => createProject(packageRoot, color, PROJECT))
}

export default { getProjects, buildTargets }
