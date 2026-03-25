// build/2025-Q4/GouseiSuika.ts
import { createProject } from '../../tools/buildOptions/baseSettings'
import { PackageBuildTarget, ProjectConfig, ProjectParams } from '@shared/utils/webpackBuild/BuildTypes'

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
  { project: 'GouseiSuika', type: 'FULL', accessLevel: 'basic', sourceProject: 'OmikujiBot' },
  { project: 'GouseiSuika', type: 'JSON', accessLevel: 'basic' },
]

// プロジェクト一覧
function getProjects(packageRoot: string): ProjectConfig[] {
  return COLOR_VARIANTS.map((color) => createProject(packageRoot, color, PROJECT))
}

export default { getProjects, buildTargets }
