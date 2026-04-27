// build/2026-Q1/LiveClockSound.ts
import { createProject } from '../../tools/buildOptions/baseSettings'
import { PackageBuildTarget, ProjectConfig, ProjectParams } from '@shared/utils/webpackBuild/BuildTypes'

const PROJECT = {
  key: 'LiveClockSound',
  series: 'LiveClock',
  title: '挨拶する時計 サウンドプレイヤー',
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
  boothId: '8268875',
  category: '2026-Q1',
  licenseLabel: 'CC-BY 4.0',
} satisfies ProjectParams

// バリエーション
const COLOR_VARIANTS = ['', 'Adv'] as const

// プロジェクト一覧
function getProjects(packageRoot: string): ProjectConfig[] {
  return COLOR_VARIANTS.map((color) => createProject(packageRoot, color, PROJECT))
}

// ビルドターゲット
const buildTargets: PackageBuildTarget[] = [
  { project: 'LiveClockSound', type: 'FULL', accessLevel: 'basic', sourceProject: 'OmikujiBot' },
  { project: 'LiveClockSound', type: 'JSON', accessLevel: 'basic' },
  { project: 'LiveClockSoundAdv', type: 'FULL', accessLevel: 'adv', sourceProject: 'OmikujiBot' },
]

export default { getProjects, buildTargets }
