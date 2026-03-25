// build/2026-Q1/StreamCounterPixel.ts
import { createProject } from '../../tools/buildOptions/baseSettings'
import { PackageBuildTarget, ProjectConfig, ProjectParams } from '@shared/utils/webpackBuild/BuildTypes'

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
  { project: 'StreamCounterPixelOhayou', type: 'FULL', accessLevel: 'basic', sourceProject: 'OmikujiBot' },
  { project: 'StreamCounterPixelOhayou', type: 'JSON', accessLevel: 'basic' },

  // { project: 'StreamCounterPixelUpVote', type: 'FULL', accessLevel: 'basic', sourceProject: 'OmikujiBot' },
  // { project: 'StreamCounterPixelBlack', type: 'FULL', accessLevel: 'adv', sourceProject: 'OmikujiBot' },
  // { project: 'StreamCounterPixelEva', type: 'FULL', accessLevel: 'pro', sourceProject: 'OmikujiBot' },
]

export default { getProjects, buildTargets }
