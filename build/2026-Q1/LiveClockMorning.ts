// build/2026-Q1/LiveClockMorning.ts
import { createProject } from '../../tools/buildOptions/baseSettings'
import type { PackageBuildTarget, ProjectConfig, ProjectParams } from '../../tools/viteBuild/types'

const PROJECT = {
  key: 'LiveClockMorning',
  series: 'LiveClock',
  title: '挨拶する時計 モーニング',
  description: 'コメントしたリスナーに挨拶してくれる 時計型BOTテンプレート',
  banner: '',
  tags: [
    'あいさつする時計',
    '初見判定',
    '初見詐欺',
    'ギフト',
    'コメント数表示',
    'コメントチェック',
    '閲覧数チェック',
    '告知',
  ],
  boothId: '8115871',
  category: '2026-Q1',
  licenseLabel: 'CC-BY 4.0',
} satisfies ProjectParams

// バリエーション
const COLOR_VARIANTS = ['', 'Night'] as const

// プロジェクト一覧
function getProjects(packageRoot: string): ProjectConfig[] {
  return COLOR_VARIANTS.map((color) => createProject(packageRoot, color, PROJECT))
}

// ビルドターゲット
const buildTargets: PackageBuildTarget[] = [
  { project: 'LiveClockMorning', accessLevel: 'basic', sourceProject: 'OmikujiBot' },
  { project: 'LiveClockMorningNight', accessLevel: 'adv', sourceProject: 'OmikujiBot' },
]

export default { getProjects, buildTargets }
