// build/2026-Q2/TweetSpikiKR.ts
import { createProject } from '../../tools/buildOptions/baseSettings'
import { PackageBuildTarget, ProjectConfig, ProjectParams } from '@shared/utils/webpackBuild/BuildTypes'

const PROJECT = {
  key: 'TweetSpikiKR',
  title: '방송용 스피키',
  description: '스피키가 시청자에게 인사하는 생성기',
  banner: '',
  tags: ['트릭컬', 'スピキ', '스피키'],
  boothId: '8281303',
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
  { project: 'TweetSpikiKR', type: 'FULL', accessLevel: 'basic', sourceProject: 'OmikujiBot' },
]

export default { getProjects, buildTargets }
