// tools/packages/solo/StreamCounterPixel.ts
import { createProject } from '../../buildOptions/baseSettings'
import { PackageBuildTarget, ProjectConfig, ProjectParams } from '@shared/utils/webpackBuild/BuildTypes'

const PROJECT = {
  key: 'StreamCounterPixel',
  title: 'おみくじ BOT ライバーカウンター ピクセル わんコメv9対応版',
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
  boothId: '8078267',
  category: 'solo',
  licenseLabel: '利用規約に従う',
} satisfies ProjectParams

// バリエーション
const COLOR_VARIANTS = ['Ohayou', 'UpVote', 'Black', 'Eva'] as const

// プロジェクト一覧
function getProjects(packageRoot: string): ProjectConfig[] {
  return COLOR_VARIANTS.map((color) => createProject(packageRoot, color, PROJECT))
}

// ビルドターゲット
const buildTargets: PackageBuildTarget[] = [
  { project: 'StreamCounterPixelOhayou', type: 'FULL', accessLevel: 'basic', sourceProject: 'OmikujiBot' },
  { project: 'StreamCounterPixelUpVote', type: 'FULL', accessLevel: 'basic', sourceProject: 'OmikujiBot' },
  { project: 'StreamCounterPixelBlack', type: 'FULL', accessLevel: 'adv', sourceProject: 'OmikujiBot' },
  { project: 'StreamCounterPixelEva', type: 'FULL', accessLevel: 'pro', sourceProject: 'OmikujiBot' },
]

export default { getProjects, buildTargets }
