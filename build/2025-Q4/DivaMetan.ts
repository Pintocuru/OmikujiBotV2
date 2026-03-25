// build/2025-Q4/DivaMetan.ts
import { createProject } from '../../tools/buildOptions/baseSettings'
import { PackageBuildTarget, ProjectConfig, ProjectParams } from '@shared/utils/webpackBuild/BuildTypes'

const PROJECT = {
  key: 'DivaMetan',
  title: '高飛車な四国めたん',
  description: '四国めたんがリスナーを歓迎してくれるジェネレーター',
  banner: '',
  tags: [
    '四国めたん',
    'VOICEVOX',
    '（ず・ω・きょ）',
    '初見判定',
    '初見詐欺',
    'ギフト',
    'コメント数表示',
    'コメントチェック',
    '閲覧数チェック',
    '漆黒のおみくじ',
    'じゃんけん',
    '閲覧数チェック',
    '告知',
  ],
  boothId: '6058829',
  category: '2025-Q4',
  licenseLabel: '利用規約に従う', // basic優先
  extraFiles: [{ from: 'assets/Characters/metan/', to: 'Characters/metan/' }],
} satisfies ProjectParams

// バリエーション定義
const COLOR_VARIANTS = [''] as const

// ビルドターゲット（proも存在するため両方定義）
const buildTargets: PackageBuildTarget[] = [
  { project: 'DivaMetan', type: 'FULL', accessLevel: 'basic', sourceProject: 'OmikujiBot' },
]

// プロジェクト一覧
function getProjects(packageRoot: string): ProjectConfig[] {
  return COLOR_VARIANTS.map((color) => createProject(packageRoot, color, PROJECT))
}

export default { getProjects, buildTargets }
