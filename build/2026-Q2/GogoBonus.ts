// build/2026-Q2/GogoBonus.ts
import { createProject } from '../../tools/buildOptions/baseSettings'
import { PackageBuildTarget, ProjectConfig, ProjectParams } from '@shared/utils/webpackBuild/BuildTypes'

const PROJECT = {
  key: 'GogoBonus',
  title: 'ペカるLAMP',
  description: 'リアクションボタンで回る！パチスロ風ジェネレーターテンプレート',
  banner: '',
  tags: ['コメントスピン', 'ペカるLAMP'],
  boothId: '8251498',
  category: '2026-Q2',
  series: 'CommentSpin',
  licenseLabel: '利用規約に従う',
  extraFiles: [
    { from: 'assets/Characters/2026-Q2/GogoBonus/', to: 'Characters/GogoBonus/' },
    { from: 'assets/sounds/2026-Q2/GogoBonus/', to: 'assets/sounds/GogoBonus/' },
  ],
} satisfies ProjectParams

// バリエーション
const COLOR_VARIANTS = [''] as const

// プロジェクト一覧
function getProjects(packageRoot: string): ProjectConfig[] {
  return COLOR_VARIANTS.map((color) => createProject(packageRoot, color, PROJECT))
}

// ビルドターゲット
const buildTargets: PackageBuildTarget[] = [
  { project: 'GogoBonus', type: 'FULL', accessLevel: 'adv', sourceProject: 'OmikujiBot' },
]

export default { getProjects, buildTargets }
