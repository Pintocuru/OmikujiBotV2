// build/2026-Q2/ToastWidget.ts
import { createProject } from '../../tools/buildOptions/baseSettings'
import { PackageBuildTarget, ProjectConfig, ProjectParams } from '@shared/utils/webpackBuild/BuildTypes'

const PROJECT = {
  key: 'ToastWidget',
  title: '挨拶するトースト',
  description: '高評価やユーザー訪問情報をトースト表示するジェネレーター',
  banner: '',
  tags: ['挨拶するトースト', '初見判定', 'ギフト', 'コメント数表示', 'コメントチェック', '閲覧数チェック', '告知'],
  boothId: '8281244',
  category: '2026-Q2',
  series: 'ToastWidget',
  licenseLabel: '利用規約に従う',
  extraFiles: [],
} satisfies ProjectParams

// バリエーション
const COLOR_VARIANTS = [''] as const

// プロジェクト一覧
function getProjects(packageRoot: string): ProjectConfig[] {
  return COLOR_VARIANTS.map((color) => createProject(packageRoot, color, PROJECT))
}

// ビルドターゲット
const buildTargets: PackageBuildTarget[] = [
  { project: 'ToastWidget', type: 'FULL', accessLevel: 'basic', sourceProject: 'OmikujiBot' },
]

export default { getProjects, buildTargets }
