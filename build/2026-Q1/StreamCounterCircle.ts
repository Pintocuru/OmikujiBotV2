// build/2026-Q1/StreamCounterCircle.ts
import { createProject } from '../../tools/buildOptions/baseSettings'
import { PackageBuildTarget, ProjectConfig, ProjectParams } from '@shared/utils/webpackBuild/BuildTypes'

const PROJECT = {
  key: 'StreamCounterCircle',
  series: 'StreamCounter',
  title: 'ライバーカウンター サークル',
  description: '高評価も！コメント数も！いろいろカウントできる多機能カウンターテンプレート',
  banner: '',
  tags: ['ライバーカウンター'],
  boothId: '8078258',
  category: '2026-Q1',
  licenseLabel: '利用規約に従う',
} satisfies ProjectParams

// バリエーション
const COLOR_VARIANTS = ['', 'UpVote', 'Black', 'Color'] as const

// プロジェクト一覧
function getProjects(packageRoot: string): ProjectConfig[] {
  return COLOR_VARIANTS.map((color) => createProject(packageRoot, color, PROJECT))
}

// ビルドターゲット
const buildTargets: PackageBuildTarget[] = [
  { project: 'StreamCounterCircle', type: 'FULL', accessLevel: 'basic', sourceProject: 'OmikujiBot' },
  { project: 'StreamCounterCircle', type: 'JSON', accessLevel: 'basic' },

  // { project: 'StreamCounterCircleUpVote', type: 'FULL', accessLevel: 'basic', sourceProject: 'OmikujiBot' },
  // { project: 'StreamCounterCircleBlack', type: 'FULL', accessLevel: 'adv', sourceProject: 'OmikujiBot' },
  // { project: 'StreamCounterCircleColor', type: 'FULL', accessLevel: 'pro', sourceProject: 'OmikujiBot' },
]

export default { getProjects, buildTargets }
