// build/2026-Q1/FlightSeatGraduation.ts
import { createProject } from '../../tools/buildOptions/baseSettings'
import type { PackageBuildTarget, ProjectConfig, ProjectParams } from '../../tools/viteBuild/types'

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
  { project: 'FlightSeatGraduation', accessLevel: 'adv', sourceProject: 'OmikujiBot' },
  // { project: 'FlightSeatGraduationPro', accessLevel: 'pro', sourceProject: 'OmikujiBot' },
]

export default { getProjects, buildTargets }
