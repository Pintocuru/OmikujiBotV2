// build/2025-Q4/TarotCard.ts
import { createProject } from '../../tools/buildOptions/baseSettings'
import { PackageBuildTarget, ProjectConfig, ProjectParams } from '@shared/utils/webpackBuild/BuildTypes'

const PROJECT = {
  key: 'TarotCard',
  title: 'タロットカード',
  description: '大アルカナの 22 枚を使う、気軽に占えるタロットカードジェネレーター',
  banner:
    'https://raw.githubusercontent.com/Pintocuru/OmikujiBot-Docs/refs/heads/main/solo/TarotCard/thumb_TarotCard.gif',
  tags: ['占い', 'タロットカード'],
  boothId: '7432682',
  category: '2025-Q4',
  licenseLabel: 'CC-BY 4.0',
  extraFiles: [],
} satisfies ProjectParams

// バリエーション定義
const COLOR_VARIANTS = [''] as const

// ビルドターゲット定義
const buildTargets: PackageBuildTarget[] = [
  { project: 'TarotCard', type: 'FULL', accessLevel: 'basic', sourceProject: 'OmikujiBot' },
  { project: 'TarotCard', type: 'JSON', accessLevel: 'basic' },
]

// プロジェクト一覧
function getProjects(packageRoot: string): ProjectConfig[] {
  return COLOR_VARIANTS.map((color) => createProject(packageRoot, color, PROJECT))
}
export default { getProjects, buildTargets }
