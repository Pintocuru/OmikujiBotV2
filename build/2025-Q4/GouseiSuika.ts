// build/2025-Q4/GouseiSuika.ts
import { createProject } from '../../tools/buildOptions/baseSettings'
import type { PackageBuildTarget, ProjectConfig, ProjectParams } from '../../tools/viteBuild/types'

const PROJECT = {
  key: 'GouseiSuika',
  title: 'スイカジェネレーター +カボチャ&クジラ',
  description: 'コメントでスイカゲーム風のおみくじを楽しめる',
  banner: '',
  tags: ['ゲームスクリプト', 'スイカジェネレーター', 'カボチャジェネレーター', 'クジラジェネレーター'],
  boothId: '5813323',
  category: '2025-Q4',
  licenseLabel: '利用規約に従う',
  extraFiles: [],
} satisfies ProjectParams

// バリエーション定義
const COLOR_VARIANTS = [''] as const

// ビルドターゲット（推定）
const buildTargets: PackageBuildTarget[] = [
  { project: 'GouseiSuika', accessLevel: 'basic', sourceProject: 'OmikujiBot' },
]

// プロジェクト一覧
function getProjects(packageRoot: string): ProjectConfig[] {
  return COLOR_VARIANTS.map((color) => createProject(packageRoot, color, PROJECT))
}

export default { getProjects, buildTargets }
