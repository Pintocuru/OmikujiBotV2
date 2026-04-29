// build/2026-Q2/TweetSpiki.ts
import { createProject } from '../../tools/buildOptions/baseSettings'
import { PackageBuildTarget, ProjectConfig, ProjectParams } from '@shared/utils/webpackBuild/BuildTypes'

const PROJECT = {
  key: 'TweetSpiki',
  title: '配信向けｽﾋﾟｷ',
  description: 'ｽﾋﾟｷ がﾁｮﾜﾖ- するジェネレーター',
  banner: '',
  tags: ['トリッカル', 'スピキ', '스피키'],
  boothId: '8281244',
  category: '2026-Q2',
  series: 'TweetSpiki',
  licenseLabel: '利用規約に従う',
  extraFiles: [
    { from: 'assets/Characters/2026-Q2/spiki/', to: 'Characters/spiki/' },
    { from: 'assets/Characters/2026-Q2/spiki_r/', to: 'Characters/spiki_r/' },
    { from: 'assets/sounds/2026-Q2/spiki/', to: 'assets/sounds/spiki/' },
  ],
} satisfies ProjectParams

// バリエーション
const COLOR_VARIANTS = [''] as const

// プロジェクト一覧
function getProjects(packageRoot: string): ProjectConfig[] {
  return COLOR_VARIANTS.map((color) => createProject(packageRoot, color, PROJECT))
}

// ビルドターゲット
const buildTargets: PackageBuildTarget[] = [
  { project: 'TweetSpiki', type: 'FULL', accessLevel: 'basic', sourceProject: 'OmikujiBot' },
]

export default { getProjects, buildTargets }
