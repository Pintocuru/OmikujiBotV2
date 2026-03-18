// tools/packages/solo/LenormandOracle.ts
import { createProject } from '../../buildOptions/baseSettings'
import { PackageBuildTarget, ProjectConfig, ProjectParams } from '@shared/utils/webpackBuild/BuildTypes'

const PROJECT = {
  key: 'LenormandOracle',
  title: 'ルノルマンカード',
  description: '配信者のためのコメントアプリ「わんコメ」で使用できる、ジェネレーターBOT',
  banner: '',
  tags: ['おみくじBOT', '占い', 'Fortune', 'ルノルマンカード', 'Lenormand'],
  boothId: '7915987',
  category: 'solo',
  licenseLabel: '利用規約に従う', // adv指定だが、指示通り単一化
  extraFiles: [],
} satisfies ProjectParams

// バリエーション定義
const COLOR_VARIANTS = [''] as const

// ビルドターゲット（adv を反映）
const buildTargets: PackageBuildTarget[] = [
  { project: 'LenormandOracle', type: 'FULL', accessLevel: 'adv', sourceProject: 'OmikujiBot' },
]

// プロジェクト一覧
function getProjects(packageRoot: string): ProjectConfig[] {
  return COLOR_VARIANTS.map((color) => createProject(packageRoot, color, PROJECT))
}

export default { getProjects, buildTargets }
