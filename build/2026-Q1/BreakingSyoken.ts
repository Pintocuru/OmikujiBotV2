// build/2026-Q1/BreakingSyoken.ts
import { createProject } from '../../tools/buildOptions/baseSettings'
import { PackageBuildTarget, ProjectConfig, ProjectParams } from '@shared/utils/webpackBuild/BuildTypes'

const PROJECT = {
  key: 'BreakingSyoken',
  title: '速報！初見さんいらっしゃい！',
  description: 'コメントしたリスナーに挨拶してくれる 速報風 BOT テンプレート',
  banner: '',
  tags: [
    'ニュースバナー',
    '速報初見さん',
    '初見判定',
    '初見詐欺',
    'ギフト',
    'コメント数表示',
    'コメントチェック',
    '閲覧数チェック',
    '告知',
  ],
  boothId: '8025815',
  category: '2026-Q1',
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

  // { project: 'BreakingSyokenRed', type: 'FULL', accessLevel: 'adv', sourceProject: 'OmikujiBot' },
  // { project: 'BreakingSyokenBlue', type: 'FULL', accessLevel: 'adv', sourceProject: 'OmikujiBot' },
  // { project: 'BreakingSyokenGreen', type: 'FULL', accessLevel: 'adv', sourceProject: 'OmikujiBot' },
  // { project: 'BreakingSyokenYellow', type: 'FULL', accessLevel: 'adv', sourceProject: 'OmikujiBot' },
  // { project: 'BreakingSyokenPremium', type: 'FULL', accessLevel: 'pro', sourceProject: 'OmikujiBot' },
]

export default { getProjects, buildTargets }
