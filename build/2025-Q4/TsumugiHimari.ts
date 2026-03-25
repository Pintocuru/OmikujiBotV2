// build/2025-Q4/TsumugiHimari.ts
import { createProject } from '../../tools/buildOptions/baseSettings'
import { PackageBuildTarget, ProjectConfig, ProjectParams } from '@shared/utils/webpackBuild/BuildTypes'

const PROJECT = {
  key: 'TsumugiHimari',
  title: 'ズッ友!つむぎ&ひまり ネットミームマシマシver',
  description: 'つむぎとひまりがノリノリでリスナーを歓迎してくれるジェネレーター',
  banner: '',
  tags: [
    'VOICEVOX',
    '春日部つむぎ',
    '冥鳴ひまり',
    '初見判定',
    '初見詐欺',
    'ギフト',
    'コメント数表示',
    'コメントチェック',
    '閲覧数チェック',
    '閲覧数チェック',
    '告知',
  ],
  boothId: '7530206',
  category: '2025-Q4',
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
