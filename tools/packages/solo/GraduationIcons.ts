// tools/packages/solo/GraduationIcons.ts
import { createProject } from '../../buildOptions/baseSettings'
import { PackageBuildTarget, ProjectConfig, ProjectParams } from '@shared/utils/webpackBuild/BuildTypes'

const PROJECT = {
  key: 'GraduationIcons',
  title: 'あつめて！卒業写真メーカー',
  description: '配信者のためのコメントアプリ「わんコメ」で使用できる、ジェネレーターBOT',
  banner: '',
  tags: [
    'おみくじBOT',
    'ユーザーリスト',
    'フライトシート',
    '卒業写真メーカー',
    'おみくじ',
    'BOT',
    'ブラウザゲーム',
    'ゲーム配信',
    '雑談配信',
    '朝活配信',
    'わんコメ',
    '初見歓迎',
    'コメントチェック',
    '初見判定ちゃん',
  ],
  boothId: '8069882',
  category: 'solo',
  licenseLabel: '利用規約に従う',
} satisfies ProjectParams

// バリエーション
const COLOR_VARIANTS = [''] as const

// プロジェクト一覧
function getProjects(packageRoot: string): ProjectConfig[] {
  return COLOR_VARIANTS.map((color) => createProject(packageRoot, color, PROJECT))
}

// ビルドターゲット
const buildTargets: PackageBuildTarget[] = [
  { project: 'GraduationIcons', type: 'FULL', accessLevel: 'adv', sourceProject: 'OmikujiBotMain' },
  { project: 'GraduationIcons', type: 'FULL', accessLevel: 'pro', sourceProject: 'OmikujiBot' },
]

export default { getProjects, buildTargets }
