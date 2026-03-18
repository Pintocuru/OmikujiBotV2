// tools/packages/full/TossedKotaro.ts
import { createProject } from '../../buildOptions/baseSettings'
import { PackageBuildTarget, ProjectConfig, ProjectParams } from '@shared/utils/webpackBuild/BuildTypes'

const PROJECT = {
  key: 'TossedKotaro',
  title: '翻弄される虎太郎',
  description: '配信者のためのコメントアプリ「わんコメ」で使用できる、ジェネレーターBOT',
  banner: '',
  tags: ['おみくじBOT', 'VOICEVOX', '白上虎太郎'],
  boothId: '6058829',
  category: 'full',
  licenseLabel: '利用規約に従う',
  extraFiles: [{ from: 'assets/Characters/kotaro/', to: 'Characters/kotaro/' }],
} satisfies ProjectParams

// バリエーション定義
const COLOR_VARIANTS = [''] as const

// ビルドターゲット（両方定義）
const buildTargets: PackageBuildTarget[] = [
  { project: 'TossedKotaro', type: 'FULL', accessLevel: 'basic', sourceProject: 'OmikujiBot' },
  { project: 'TossedKotaro', type: 'FULL', accessLevel: 'pro', sourceProject: 'OmikujiBot' },
]

// プロジェクト一覧
function getProjects(packageRoot: string): ProjectConfig[] {
  return COLOR_VARIANTS.map((color) => createProject(packageRoot, color, PROJECT))
}

export default { getProjects, buildTargets }
