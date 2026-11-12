// build/2026-Q1/LenormandOracle.ts
import { createProject } from '../../tools/buildOptions/baseSettings'
import type { PackageBuildTarget, ProjectConfig, ProjectParams } from '../../tools/viteBuild/types'

const PROJECT = {
  key: 'LenormandOracle',
  title: 'ルノルマンカード',
  description: '36 枚のシンボルからメッセージを受け取る、気軽に占えるルノルマンカードジェネレーター',
  banner: '',
  tags: ['占い', 'ルノルマンカード'],
  boothId: '7915987',
  category: '2026-Q1',
  licenseLabel: '利用規約に従う', // adv指定だが、指示通り単一化
  extraFiles: [],
} satisfies ProjectParams

// バリエーション定義
const COLOR_VARIANTS = [''] as const

// ビルドターゲット（adv を反映）
const buildTargets: PackageBuildTarget[] = [
  { project: 'LenormandOracle', accessLevel: 'adv', sourceProject: 'OmikujiBot' },
]

// プロジェクト一覧
function getProjects(packageRoot: string): ProjectConfig[] {
  return COLOR_VARIANTS.map((color) => createProject(packageRoot, color, PROJECT))
}

export default { getProjects, buildTargets }
