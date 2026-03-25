// build/common/OmikujiBotSpecial.ts
import { createProject } from '../../tools/buildOptions/baseSettings'
import { PackageBuildTarget, ProjectConfig, ProjectParams } from '@shared/utils/webpackBuild/BuildTypes'

const PROJECT = {
  key: 'OmikujiBotSpecial',
  title: 'せすぴん用',
  description: 'てんこ盛りだぜ！',
  banner: '',
  tags: ['おみくじBOT'],
  boothId: '5471598',
  category: 'common',
  licenseLabel: '個人利用のみ', // basic / pro 共通なのでそのまま
  extraFiles: [
    { from: 'assets/Characters/chocolate/', to: 'Characters/chocolate/' },
    { from: 'assets/Characters/cafelatte/', to: 'Characters/cafelatte/' },
  ],
} satisfies ProjectParams

// バリエーション定義
const COLOR_VARIANTS = [''] as const

// ビルドターゲット（proも存在するため両方定義）
const buildTargets: PackageBuildTarget[] = [
  { project: 'OmikujiBotSpecial', type: 'FULL', accessLevel: 'godMode', sourceProject: 'OmikujiBot' },
]

// プロジェクト一覧
function getProjects(packageRoot: string): ProjectConfig[] {
  return COLOR_VARIANTS.map((color) => createProject(packageRoot, color, PROJECT))
}

export default { getProjects, buildTargets }
