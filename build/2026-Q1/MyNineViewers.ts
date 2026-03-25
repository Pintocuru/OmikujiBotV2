// build/2026-Q1/MyNineViewers.ts
import { createProject } from '../../tools/buildOptions/baseSettings'
import { PackageBuildTarget, ProjectConfig, ProjectParams } from '@shared/utils/webpackBuild/BuildTypes'

const PROJECT = {
  key: 'MyNineViewers',
  title: '私を構成する 9 人のユーザー。',
  description: 'コメントしたユーザーをランダムに枠に入れるジェネレーター',
  banner: '',
  tags: ['私を構成する9人のユーザー。', 'フライトシート'],
  boothId: '8060471',
  category: '2026-Q1',
  licenseLabel: '利用規約に従う',
} satisfies ProjectParams

// バリエーション
const COLOR_VARIANTS = ['', 'Adv', 'Pro'] as const

// プロジェクト一覧
function getProjects(packageRoot: string): ProjectConfig[] {
  return COLOR_VARIANTS.map((color) => createProject(packageRoot, color, PROJECT))
}

// ビルドターゲット
const buildTargets: PackageBuildTarget[] = [
  { project: 'MyNineViewers', type: 'FULL', accessLevel: 'basic', sourceProject: 'OmikujiBotMain' },
  { project: 'MyNineViewers', type: 'JSON', accessLevel: 'basic' },
  // { project: 'MyNineViewersAdv', type: 'FULL', accessLevel: 'adv', sourceProject: 'OmikujiBot' },
  // { project: 'MyNineViewersPro', type: 'FULL', accessLevel: 'pro', sourceProject: 'OmikujiBot' },
]

export default { getProjects, buildTargets }
