// tools/packages/solo/StreamCounterCircle.ts
import { createProject } from '../../buildOptions/baseSettings'
import { PackageBuildTarget, ProjectConfig, ProjectParams } from '@shared/utils/webpackBuild/BuildTypes'

const PROJECT = {
  key: 'TarotCard',
  title: 'タロットカード',
  description: '配信者のためのコメントアプリ「わんコメ」で使用できる、ジェネレーターBOT',
  banner:
    'https://raw.githubusercontent.com/Pintocuru/OmikujiBot-Docs/refs/heads/main/solo/TarotCard/thumb_TarotCard.gif',
  tags: ['おみくじBOT', '占い', 'Fortune', 'タロット', 'tarot'],
  boothId: '7432682',
  category: 'solo',
  licenseLabel: 'CC-BY 4.0',
  extraFiles: [],
} satisfies ProjectParams

// バリエーション定義
const COLOR_VARIANTS = [''] as const

// ビルドターゲット定義
const buildTargets: PackageBuildTarget[] = [
  { project: 'TarotCard', type: 'FULL', accessLevel: 'basic', sourceProject: 'OmikujiBot' },
]

// プロジェクト一覧
function getProjects(packageRoot: string): ProjectConfig[] {
  return COLOR_VARIANTS.map((color) => createProject(packageRoot, color, PROJECT))
}
export default { getProjects, buildTargets }
