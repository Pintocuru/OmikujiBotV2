// build/2026-Q2/CookieCounterSakura.ts
import { createProject } from '../../tools/buildOptions/baseSettings'
import type { PackageBuildTarget, ProjectConfig, ProjectParams } from '../../tools/viteBuild/types'

const PROJECT = {
  key: 'SakuraCounter',
  title: '桜カウンター',
  description: '高評価も！コメント数も！いろいろカウントできる多機能カウンターテンプレート',
  banner: '',
  tags: ['クッキーカウンター', '桜カウンター'],
  boothId: '8162455',
  category: '2026-Q2',
  series: 'CookieCounter',
  licenseLabel: 'CC-BY 4.0',
  extraFiles: [{ from: 'assets/Characters/2026-Q2/CookieCounterSakura/', to: 'Characters/CookieCounterSakura/' }],
} satisfies ProjectParams

// バリエーション
const COLOR_VARIANTS = [''] as const

// プロジェクト一覧
function getProjects(packageRoot: string): ProjectConfig[] {
  return COLOR_VARIANTS.map((color) => createProject(packageRoot, color, PROJECT))
}

// ビルドターゲット
const buildTargets: PackageBuildTarget[] = [
  { project: 'SakuraCounter', accessLevel: 'adv', sourceProject: 'OmikujiBot' },
  // { project: 'SakuraCounterOhayou', accessLevel: 'adv', sourceProject: 'OmikujiBot' },
]

export default { getProjects, buildTargets }
