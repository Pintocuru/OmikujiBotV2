// tools/packages/full/ReimuMarisa.ts
import { createProject } from '../../buildOptions/baseSettings'
import { PackageBuildTarget, ProjectConfig, ProjectParams } from '@shared/utils/webpackBuild/BuildTypes'

const PROJECT = {
  key: 'ReimuMarisa',
  title: 'ゆっくり霊夢&魔理沙',
  description: '配信者のためのコメントアプリ「わんコメ」で使用できる、ジェネレーターBOT',
  banner: '',
  tags: ['おみくじBOT', 'おみくじ', '占い', 'ゆっくり', 'ゆっくり霊夢', 'ゆっくり魔理沙', 'じゃんけん'],
  boothId: '5471598',
  category: 'full',
  licenseLabel: '利用規約に従う',
  extraFiles: [
    { from: 'assets/Characters/reimu/', to: 'Characters/reimu/' },
    { from: 'assets/Characters/marisa/', to: 'Characters/marisa/' },
  ],
} satisfies ProjectParams

// バリエーション定義
const COLOR_VARIANTS = [''] as const

// ビルドターゲット
const buildTargets: PackageBuildTarget[] = [
  { project: 'ReimuMarisa', type: 'FULL', accessLevel: 'basic', sourceProject: 'OmikujiBot' },
]

// プロジェクト一覧
function getProjects(packageRoot: string): ProjectConfig[] {
  return COLOR_VARIANTS.map((color) => createProject(packageRoot, color, PROJECT))
}

export default { getProjects, buildTargets }
