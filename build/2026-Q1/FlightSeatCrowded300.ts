// build/2026-Q1/FlightSeatCrowded300.ts
import { createProject } from '../../tools/buildOptions/baseSettings'
import { PackageBuildTarget, ProjectConfig, ProjectParams } from '@shared/utils/webpackBuild/BuildTypes'

const PROJECT = {
  key: 'FlightSeatCrowded300',
  title: '300人埋めてみろよVTuber',
  description: 'コメントしたユーザーをランダムに枠に入れるジェネレーター',
  banner: '',
  tags: ['フライトシート', '300人埋めてみろよVTuber'],
  boothId: '8145288',
  category: '2026-Q1',
  series: 'FlightSeat',
  licenseLabel: 'CC-BY 4.0',
} satisfies ProjectParams

// バリエーション
const COLOR_VARIANTS = [''] as const

// プロジェクト一覧
function getProjects(packageRoot: string): ProjectConfig[] {
  return COLOR_VARIANTS.map((color) => createProject(packageRoot, color, PROJECT))
}

// ビルドターゲット
const buildTargets: PackageBuildTarget[] = [
  { project: 'FlightSeatCrowded300', type: 'FULL', accessLevel: 'basic', sourceProject: 'OmikujiBot' },
  { project: 'FlightSeatCrowded300', type: 'JSON', accessLevel: 'basic' },
]

export default { getProjects, buildTargets }
