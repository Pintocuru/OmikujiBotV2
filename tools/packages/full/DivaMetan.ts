// tools/packages/full/DivaMetan.ts
import { createProject } from '../../buildOptions/baseSettings'
import { PackageBuildTarget, ProjectConfig, ProjectParams } from '@shared/utils/webpackBuild/BuildTypes'

const PROJECT = {
  key: 'DivaMetan',
  title: '高飛車な四国めたん',
  description: '配信者のためのコメントアプリ「わんコメ」で使用できる、ジェネレーターBOT',
  banner: '',
  tags: ['おみくじBOT', 'VOICEVOX', '四国めたん', '（ず・ω・きょ）'],
  boothId: '6058829',
  category: 'full',
  licenseLabel: '利用規約に従う', // basic優先
  extraFiles: [{ from: 'assets/Characters/metan/', to: 'Characters/metan/' }],
} satisfies ProjectParams

// バリエーション定義
const COLOR_VARIANTS = [''] as const

// ビルドターゲット（proも存在するため両方定義）
const buildTargets: PackageBuildTarget[] = [
  { project: 'DivaMetan', type: 'FULL', accessLevel: 'basic', sourceProject: 'OmikujiBot' },
]

// プロジェクト一覧
function getProjects(packageRoot: string): ProjectConfig[] {
  return COLOR_VARIANTS.map((color) => createProject(packageRoot, color, PROJECT))
}

export default { getProjects, buildTargets }
