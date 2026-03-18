// tools/packages/sesupin/StrawberryChocolate.ts
import { createProject } from '../../buildOptions/baseSettings'
import { PackageBuildTarget, ProjectConfig, ProjectParams } from '@shared/utils/webpackBuild/BuildTypes'

const PROJECT = {
  key: 'StrawberryChocolate',
  title: 'ストロベリーショコラ',
  description: '配信者のためのコメントアプリ「わんコメ」で使用できる、ジェネレーターBOT',
  banner: '',
  tags: [
    'おみくじBOT',
    'ユーザーリスト',
    'ライバーカウンター',
    'おみくじ',
    'BOT',
    'カウンター',
    '高評価',
    '同時接続数',
    'ゲーム配信',
    '雑談配信',
    '朝活配信',
    'わんコメ',
    '初見歓迎',
  ],
  boothId: '7733810',
  category: 'solo',
  licenseLabel: '利用規約に従う',
  extraFiles: [{ from: 'assets/Characters/chocolate/', to: 'Characters/chocolate/' }],
} satisfies ProjectParams

// バリエーション定義
const COLOR_VARIANTS = [''] as const

// ビルドターゲット（pro はコメントアウトされていたため basic のみ採用）
const buildTargets: PackageBuildTarget[] = [
  { project: 'StrawberryChocolate', type: 'FULL', accessLevel: 'basic', sourceProject: 'OmikujiBot' },
]

// プロジェクト一覧
function getProjects(packageRoot: string): ProjectConfig[] {
  return COLOR_VARIANTS.map((color) => createProject(packageRoot, color, PROJECT))
}

export default { getProjects, buildTargets }
