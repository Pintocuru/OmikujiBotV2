// build/2026-Q1/FlightSeatGraduation.ts
import { createProject } from '../../tools/buildOptions/baseSettings'
import { PackageBuildTarget, ProjectConfig, ProjectParams } from '@shared/utils/webpackBuild/BuildTypes'

const PROJECT = {
  key: 'FlightSeatGraduation',
  title: 'あつめて！卒業写真メーカー',
  description: 'コメントしたユーザーをランダムに枠に入れるジェネレーター',
  banner: '',
  tags: ['卒業写真メーカー', 'フライトシート'],
  boothId: '8069882',
  category: '2026-Q1',
  series: 'FlightSeat',
  licenseLabel: '利用規約に従う',
} satisfies ProjectParams

// バリエーション
const COLOR_VARIANTS = ['', 'Pro'] as const

// プロジェクト一覧
function getProjects(packageRoot: string): ProjectConfig[] {
  return COLOR_VARIANTS.map((color) => createProject(packageRoot, color, PROJECT))
}

// ビルドターゲット
const buildTargets: PackageBuildTarget[] = [
  { project: 'FlightSeatGraduation', type: 'FULL', accessLevel: 'adv', sourceProject: 'OmikujiBot' },
  { project: 'FlightSeatGraduation', type: 'JSON', accessLevel: 'basic' },
  { project: 'FlightSeatGraduationPro', type: 'FULL', accessLevel: 'pro', sourceProject: 'OmikujiBot' },
]

export default { getProjects, buildTargets }
