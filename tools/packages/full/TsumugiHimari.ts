// tools/packages/full/TsumugiHimari.ts
import { createProject } from '../../buildOptions/baseSettings'
import { PackageBuildTarget, ProjectConfig, ProjectParams } from '@shared/utils/webpackBuild/BuildTypes'

const PROJECT = {
  key: 'TsumugiHimari',
  title: 'ズッ友!つむぎ&ひまり ネットミームマシマシ ver',
  description: '配信者のためのコメントアプリ「わんコメ」で使用できる、ジェネレーターBOT',
  banner: '',
  tags: ['おみくじBOT', 'VOICEVOX', '春日部つむぎ', '冥鳴ひまり'],
  boothId: '7530206',
  category: 'full',
  licenseLabel: 'CC-BY 4.0', // basic優先
  extraFiles: [
    { from: 'assets/Characters/tsumugi/', to: 'Characters/tsumugi/' },
    { from: 'assets/Characters/himari/', to: 'Characters/himari/' },
  ],
} satisfies ProjectParams

// バリエーション定義
const COLOR_VARIANTS = [''] as const

// ビルドターゲット（両方定義）
const buildTargets: PackageBuildTarget[] = [
  { project: 'TsumugiHimari', type: 'FULL', accessLevel: 'basic', sourceProject: 'OmikujiBot' },
  { project: 'TsumugiHimari', type: 'FULL', accessLevel: 'pro', sourceProject: 'OmikujiBot' },
]

// プロジェクト一覧
function getProjects(packageRoot: string): ProjectConfig[] {
  return COLOR_VARIANTS.map((color) => createProject(packageRoot, color, PROJECT))
}

export default { getProjects, buildTargets }
