// build/2026-Q1/StreamCounterPixel.ts
import { createProject } from '../../tools/buildOptions/baseSettings'
import type { PackageBuildTarget, ProjectConfig, ProjectParams } from '../../tools/viteBuild/types'

const PROJECT = {
  key: 'StreamCounterPixel',
  series: 'StreamCounter',
  title: 'ライバーカウンター ピクセル',
  description: '高評価も！コメント数も！いろいろカウントできる多機能カウンターテンプレート',
  banner: '',
  tags: ['ライバーカウンター', 'おはようカウンター', 'ワロタカウンター', 'ナイスカウンター'],
  boothId: '8078267',
  category: '2026-Q1',
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
  { project: 'StreamCounterPixelOhayou', accessLevel: 'basic', sourceProject: 'OmikujiBot' },
  { project: 'StreamCounterPixelUpVote', accessLevel: 'basic', sourceProject: 'OmikujiBot' },
  { project: 'StreamCounterPixelBlack', accessLevel: 'adv', sourceProject: 'OmikujiBot' },
  { project: 'StreamCounterPixelEva', accessLevel: 'pro', sourceProject: 'OmikujiBot' },
]

export default { getProjects, buildTargets }
