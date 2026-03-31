// build/2026-Q1/FlightSeatCrowded100.ts
import { createProject } from '../../tools/buildOptions/baseSettings'
import { PackageBuildTarget, ProjectConfig, ProjectParams } from '@shared/utils/webpackBuild/BuildTypes'

const PROJECT = {
  key: 'FlightSeatCrowded100',
  title: 'ともだち100人できるかな',
  description: 'コメントしたユーザーをランダムに枠に入れるジェネレーター',
  banner: '',
  tags: ['フライトシート', 'ともだち100人できるかな'],
  boothId: '8145227',
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
  { project: 'FlightSeatCrowded100', type: 'FULL', accessLevel: 'adv', sourceProject: 'OmikujiBot' },
  { project: 'FlightSeatCrowded100', type: 'JSON', accessLevel: 'basic' },
]

export default { getProjects, buildTargets }
