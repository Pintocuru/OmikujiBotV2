// tools/packages/solo/BigBangFortune.ts
import { createProject } from '../../buildOptions/baseSettings'
import { PackageBuildTarget, ProjectConfig, ProjectParams } from '@shared/utils/webpackBuild/BuildTypes'

const PROJECT = {
  key: 'BigBangFortune',
  title: '超おみくじ',
  description: '配信者のためのコメントアプリ「わんコメ」で使用できる、ジェネレーターBOT',
  banner:
    'https://raw.githubusercontent.com/Pintocuru/OmikujiBot-Docs/refs/heads/main/solo/BigBangFortune/thumb_BigBangFortune.gif',
  tags: ['おみくじBOT', '超', 'おみくじ'],
  boothId: '7440428',
  category: 'solo',
  licenseLabel: 'CC-BY 4.0',
  extraFiles: [],
} satisfies ProjectParams

// バリエーション定義
const COLOR_VARIANTS = [''] as const

// ビルドターゲット（必要なら追加）
const buildTargets: PackageBuildTarget[] = [
  { project: 'BigBangFortune', type: 'FULL', accessLevel: 'basic', sourceProject: 'OmikujiBot' },
]

// プロジェクト一覧
function getProjects(packageRoot: string): ProjectConfig[] {
  return COLOR_VARIANTS.map((color) => createProject(packageRoot, color, PROJECT))
}

export default { getProjects, buildTargets }
