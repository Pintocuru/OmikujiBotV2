// tools/packages/solo/GraduationIcons.ts
import { createProject } from '../../buildOptions/baseSettings'
import { PackageBuildTarget, ProjectConfig, ProjectParams } from '@shared/utils/webpackBuild/BuildTypes'

const PROJECT = {
  key: 'GraduationIcons',
  title: 'あつめて！卒業写真メーカー',
  description: 'コメントしたユーザーをランダムに枠に入れるジェネレーター',
  banner: '',
  tags: ['卒業写真メーカー', 'フライトシート'],
  boothId: '8069882',
  category: '2026-Q1',
  licenseLabel: '利用規約に従う',
} satisfies ProjectParams

// バリエーション
const COLOR_VARIANTS = [''] as const

// プロジェクト一覧
function getProjects(packageRoot: string): ProjectConfig[] {
  return COLOR_VARIANTS.map((color) => createProject(packageRoot, color, PROJECT))
}

// ビルドターゲット
const buildTargets: PackageBuildTarget[] = [
  { project: 'GraduationIcons', type: 'FULL', accessLevel: 'adv', sourceProject: 'OmikujiBotMain' },
  { project: 'GraduationIcons', type: 'JSON', accessLevel: 'basic' },
  { project: 'GraduationIcons', type: 'FULL', accessLevel: 'pro', sourceProject: 'OmikujiBot' },
]

export default { getProjects, buildTargets }
