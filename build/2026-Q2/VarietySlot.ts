// build/2026-Q2/VarietySlot.ts
import { createProject } from '../../tools/buildOptions/baseSettings'
import { PackageBuildTarget, ProjectConfig, ProjectParams } from '@shared/utils/webpackBuild/BuildTypes'

const PROJECT = {
  key: 'VarietySlot',
  title: 'クイズせかいはバラエティスロット',
  description: 'リスナーが増えるほど回る!昭和バラエティ風スロットテンプレート',
  banner: '',
  tags: ['コメントスピン', 'クイズせかいはバラエティスロット'],
  boothId: '8188701',
  category: '2026-Q2',
  series: 'CommentSpin',
  licenseLabel: '利用規約に従う',
  extraFiles: [{ from: 'assets/Characters/VarietySlot/', to: 'Characters/VarietySlot/' }],
} satisfies ProjectParams

// バリエーション
const COLOR_VARIANTS = ['', 'Ranking'] as const

// プロジェクト一覧
function getProjects(packageRoot: string): ProjectConfig[] {
  return COLOR_VARIANTS.map((color) => createProject(packageRoot, color, PROJECT))
}

// ビルドターゲット
const buildTargets: PackageBuildTarget[] = [
  { project: 'VarietySlot', type: 'FULL', accessLevel: 'adv', sourceProject: 'OmikujiBot' },
  { project: 'VarietySlotRanking', type: 'FULL', accessLevel: 'pro', sourceProject: 'OmikujiBot' },
]

export default { getProjects, buildTargets }
