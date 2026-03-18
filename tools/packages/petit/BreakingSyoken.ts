// tools/packages/petit/BreakingSyoken.ts
import { createProject } from '../../buildOptions/baseSettings'
import { PackageBuildTarget, ProjectConfig, ProjectParams } from '@shared/utils/webpackBuild/BuildTypes'

const PROJECT = {
  key: 'BreakingSyoken',
  title: '速報！初見さんいらっしゃい！',
  description: '配信者のためのコメントアプリ「わんコメ」で使用できる、ジェネレーターBOT',
  banner: '',
  tags: [
    'おみくじBOT',
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
  boothId: '8025815',
  category: 'petit',
  licenseLabel: 'CC-BY 4.0',
} satisfies ProjectParams

// バリエーション
const COLOR_VARIANTS = ['', 'Red', 'Blue', 'Green', 'Yellow', 'Premium'] as const

// プロジェクト一覧
function getProjects(packageRoot: string): ProjectConfig[] {
  return COLOR_VARIANTS.map((color) => createProject(packageRoot, color, PROJECT))
}

// ビルドターゲット
const buildTargets: PackageBuildTarget[] = [
  { project: 'BreakingSyoken', type: 'FULL', accessLevel: 'basic', sourceProject: 'OmikujiBot' },
  { project: 'BreakingSyoken', type: 'JSON', accessLevel: 'basic' },

  { project: 'BreakingSyokenRed', type: 'FULL', accessLevel: 'adv', sourceProject: 'OmikujiBot' },
  { project: 'BreakingSyokenBlue', type: 'FULL', accessLevel: 'adv', sourceProject: 'OmikujiBot' },
  { project: 'BreakingSyokenGreen', type: 'FULL', accessLevel: 'adv', sourceProject: 'OmikujiBot' },
  { project: 'BreakingSyokenYellow', type: 'FULL', accessLevel: 'adv', sourceProject: 'OmikujiBot' },

  { project: 'BreakingSyokenPremium', type: 'FULL', accessLevel: 'pro', sourceProject: 'OmikujiBot' },
]

export default { getProjects, buildTargets }
