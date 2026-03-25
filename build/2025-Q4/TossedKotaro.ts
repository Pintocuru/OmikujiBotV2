// build/2025-Q4/TossedKotaro.ts
import { createProject } from '../../tools/buildOptions/baseSettings'
import { PackageBuildTarget, ProjectConfig, ProjectParams } from '@shared/utils/webpackBuild/BuildTypes'

const PROJECT = {
  key: 'TossedKotaro',
  title: '翻弄される虎太郎',
  description: 'test',
  banner: '',
  tags: [
    'VOICEVOX',
    '白上虎太郎',
    '初見判定',
    '初見詐欺',
    'ギフト',
    'コメント数表示',
    'コメントチェック',
    '閲覧数チェック',
    '閲覧数チェック',
    '告知',
  ],
  boothId: '6058829',
  category: '2025-Q4',
  licenseLabel: '利用規約に従う',
  extraFiles: [{ from: 'assets/Characters/kotaro/', to: 'Characters/kotaro/' }],
} satisfies ProjectParams

// バリエーション定義
const COLOR_VARIANTS = [''] as const

// ビルドターゲット（両方定義）
const buildTargets: PackageBuildTarget[] = [
  { project: 'TossedKotaro', type: 'FULL', accessLevel: 'basic', sourceProject: 'OmikujiBot' },
]

// プロジェクト一覧
function getProjects(packageRoot: string): ProjectConfig[] {
  return COLOR_VARIANTS.map((color) => createProject(packageRoot, color, PROJECT))
}

export default { getProjects, buildTargets }
