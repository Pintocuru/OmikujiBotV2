// build/2026-Q2/SlotPortrait.ts
import { createProject } from '../../tools/buildOptions/baseSettings'
import { PackageBuildTarget, ProjectConfig, ProjectParams } from '@shared/utils/webpackBuild/BuildTypes'

const PROJECT = {
  key: 'SlotPortrait',
  title: 'イラストガチャメーカー',
  description: 'ガチャに！ゲームに！多彩に使えるスロット風テンプレート',
  banner: '',
  tags: ['コメントスピン', 'イラストガチャメーカー'],
  boothId: '8188701',
  category: '2026-Q2',
  series: 'CommentSpin',
  licenseLabel: 'CC-BY 4.0',
  extraFiles: [{ from: 'assets/Characters/SlotPortrait/', to: 'Characters/SlotPortrait/' }],
} satisfies ProjectParams

// バリエーション
const COLOR_VARIANTS = [''] as const

// プロジェクト一覧
function getProjects(packageRoot: string): ProjectConfig[] {
  return COLOR_VARIANTS.map((color) => createProject(packageRoot, color, PROJECT))
}

// ビルドターゲット
const buildTargets: PackageBuildTarget[] = [
  { project: 'SlotPortrait', type: 'FULL', accessLevel: 'adv', sourceProject: 'OmikujiBot' },
  { project: 'SlotPortrait', type: 'JSON', accessLevel: 'basic' },
]

export default { getProjects, buildTargets }
