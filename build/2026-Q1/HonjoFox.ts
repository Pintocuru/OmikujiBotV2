// build/2026-Q1/HonjoFox.ts
import { createProject } from '../../tools/buildOptions/baseSettings'
import { PackageBuildTarget, ProjectConfig, ProjectParams } from '@shared/utils/webpackBuild/BuildTypes'

const PROJECT = {
  key: 'HonjoFox',
  title: '中仙道の村きつね',
  description: '古いきつねがぼやきます',
  banner: '',
  tags: ['中仙道の村きつね', '初見判定', 'ギフト', 'コメント数表示', 'コメントチェック', '閲覧数チェック'],
  boothId: '7982286',
  category: '2026-Q1',
  licenseLabel: 'CC-BY 4.0',
  extraFiles: [{ from: 'assets/Characters/HonjoFox/', to: 'Characters/HonjoFox/' }],
} satisfies ProjectParams

// バリエーション定義
const COLOR_VARIANTS = [''] as const

// ビルドターゲット（推定）
const buildTargets: PackageBuildTarget[] = [
  { project: 'HonjoFox', type: 'FULL', accessLevel: 'basic', sourceProject: 'OmikujiBot' },
  { project: 'HonjoFox', type: 'JSON', accessLevel: 'basic' },
]

// プロジェクト一覧
function getProjects(packageRoot: string): ProjectConfig[] {
  return COLOR_VARIANTS.map((color) => createProject(packageRoot, color, PROJECT))
}

export default { getProjects, buildTargets }
