// build/2025-Q4/ReimuMarisa.ts
import { createProject } from '../../tools/buildOptions/baseSettings'
import { PackageBuildTarget, ProjectConfig, ProjectParams } from '@shared/utils/webpackBuild/BuildTypes'

const PROJECT = {
  key: 'ReimuMarisa',
  title: 'ゆっくり霊夢&魔理沙',
  description: 'ゆっくり霊夢と魔理沙がリスナーを歓迎してくれるジェネレーター',
  banner: '',
  tags: [
    'ゆっくり',
    'ゆっくり霊夢',
    'ゆっくり魔理沙',
    '初見判定',
    '初見詐欺',
    'ギフト',
    'コメント数表示',
    'コメントチェック',
    '閲覧数チェック',
    '巫女さんのおみくじ',
    'フラワー占い',
    'じゃんけん',
    '閲覧数チェック',
    '告知',
  ],
  boothId: '5471598',
  category: '2025-Q4',
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
