// build/2026-Q2/Golden65536.ts
import { createProject } from '../../tools/buildOptions/baseSettings'
import { PackageBuildTarget, ProjectConfig, ProjectParams } from '@shared/utils/webpackBuild/BuildTypes'

const PROJECT = {
  key: 'Golden65536',
  title: 'Golden65536',
  description: 'リアクションボタンで回る！パチスロ風ジェネレーターテンプレート',
  banner: '',
  tags: ['コメントスピン', 'ゴールデン65536'],
  boothId: '8188701',
  category: '2026-Q2',
  series: 'CommentSpin',
  licenseLabel: 'CC-BY 4.0',
  extraFiles: [{ from: 'assets/Characters/Golden65536/', to: 'Characters/Golden65536/' }],
} satisfies ProjectParams

// バリエーション
const COLOR_VARIANTS = [''] as const

// プロジェクト一覧
function getProjects(packageRoot: string): ProjectConfig[] {
  return COLOR_VARIANTS.map((color) => createProject(packageRoot, color, PROJECT))
}

// ビルドターゲット
const buildTargets: PackageBuildTarget[] = [
  { project: 'Golden65536', type: 'FULL', accessLevel: 'adv', sourceProject: 'OmikujiBot' },
]

export default { getProjects, buildTargets }
