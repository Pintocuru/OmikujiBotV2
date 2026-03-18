// tools/packages/petit/HonjoFox.ts
import { createProject } from '../../buildOptions/baseSettings'
import { PackageBuildTarget, ProjectConfig, ProjectParams } from '@shared/utils/webpackBuild/BuildTypes'

const PROJECT = {
  key: 'HonjoFox',
  title: '中仙道の村きつね',
  description: '配信者のためのコメントアプリ「わんコメ」で使用できる、ジェネレーターBOT',
  banner: '',
  tags: ['おみくじBOT', 'BOT', '中仙道の村きつね', 'コメントチェック', '初見判定ちゃん'],
  boothId: '7982286',
  category: 'petit',
  licenseLabel: 'CC-BY 4.0',
  extraFiles: [
    { from: 'assets/thumb/thumb_HonjoFox.gif', to: 'thumb.gif' },
    { from: 'assets/Characters/HonjoFox/', to: 'Characters/HonjoFox/' },
  ],
} satisfies ProjectParams

// バリエーション定義
const COLOR_VARIANTS = [''] as const

// ビルドターゲット（推定）
const buildTargets: PackageBuildTarget[] = [
  { project: 'HonjoFox', type: 'FULL', accessLevel: 'basic', sourceProject: 'OmikujiBot' },
]

// プロジェクト一覧
function getProjects(packageRoot: string): ProjectConfig[] {
  return COLOR_VARIANTS.map((color) => createProject(packageRoot, color, PROJECT))
}

export default { getProjects, buildTargets }
