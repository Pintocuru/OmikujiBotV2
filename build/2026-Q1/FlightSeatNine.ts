// build/2026-Q1/FlightSeatNine.ts
import { createProject } from '../../tools/buildOptions/baseSettings'
import { PackageBuildTarget, ProjectConfig, ProjectParams } from '@shared/utils/webpackBuild/BuildTypes'

const PROJECT = {
  key: 'FlightSeatNine',
  title: '私を構成する 9 人のユーザー。',
  description: 'コメントしたユーザーをランダムに枠に入れるジェネレーター',
  banner: '',
  tags: ['私を構成する9人のユーザー。', 'フライトシート'],
  boothId: '8060471',
  category: '2026-Q1',
  series: 'FlightSeat',
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
  { project: 'FlightSeatNine', type: 'FULL', accessLevel: 'basic', sourceProject: 'OmikujiBot' },
  { project: 'FlightSeatNine', type: 'JSON', accessLevel: 'basic' },
]

export default { getProjects, buildTargets }
