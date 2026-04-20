// build/2026-Q2/VarietySlot.ts
import { createProject } from '../../tools/buildOptions/baseSettings'
import { PackageBuildTarget, ProjectConfig, ProjectParams } from '@shared/utils/webpackBuild/BuildTypes'

const PROJECT = {
  key: 'VarietySlot',
  title: '配信マネーは今回ドォーダイ!!',
  description: 'リスナーが増えるほど回る!昭和バラエティ風スロットテンプレート',
  banner: '',
  tags: ['コメントスピン', 'クイズバラエティスロット'],
  boothId: '8188701',
  category: '2026-Q2',
  series: 'CommentSpin',
  licenseLabel: 'CC-BY 4.0',
  extraFiles: [{ from: 'assets/Characters/VarietySlot/', to: 'Characters/VarietySlot/' }],
} satisfies ProjectParams

// バリエーション
const COLOR_VARIANTS = [''] as const

// プロジェクト一覧
function getProjects(packageRoot: string): ProjectConfig[] {
  return COLOR_VARIANTS.map((color) => createProject(packageRoot, color, PROJECT))
}

// ビルドターゲット
const buildTargets: PackageBuildTarget[] = [
  { project: 'VarietySlot', type: 'FULL', accessLevel: 'adv', sourceProject: 'OmikujiBot' },
]

export default { getProjects, buildTargets }
