// build/2026-Q1/ValentineCoupling.ts
import { createProject } from '../../tools/buildOptions/baseSettings'
import { PackageBuildTarget, ProjectConfig, ProjectParams } from '@shared/utils/webpackBuild/BuildTypes'

const PROJECT = {
  key: 'ValentineCoupling',
  title: 'バレンタイン・カップリング',
  description: 'test',
  banner: '',
  tags: ['バレンタイン・カップリング', 'ラッキーメンバーズ'],
  boothId: '7432682',
  category: '2026-Q1',
  licenseLabel: 'CC-BY 4.0',
  extraFiles: [],
} satisfies ProjectParams

// バリエーション定義
const COLOR_VARIANTS = [''] as const

// ビルドターゲット（推定）
const buildTargets: PackageBuildTarget[] = [
  { project: 'ValentineCoupling', type: 'FULL', accessLevel: 'basic', sourceProject: 'OmikujiBot' },
  { project: 'ValentineCoupling', type: 'JSON', accessLevel: 'basic' },
]

// プロジェクト一覧
function getProjects(packageRoot: string): ProjectConfig[] {
  return COLOR_VARIANTS.map((color) => createProject(packageRoot, color, PROJECT))
}

export default { getProjects, buildTargets }
