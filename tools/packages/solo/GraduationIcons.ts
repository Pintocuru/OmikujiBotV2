// tools/packages/solo/GraduationIcons.ts
import { createCommonBuildConfig, createCommonBuildConfigJson } from '../../buildOptions/baseSettings'
import { PackageBuildTarget, ProjectConfig } from '@shared/utils/webpackBuild/BuildTypes'

const PROJECT_KEY = 'GraduationIcons'
const PROJECT_TITLE = 'おみくじ BOT あつめて！卒業写真メーカー'
const boothURLNumber = '8069882'

// バリエーション定義  '' の場合はデフォルト（無印）扱い
const COLOR_VARIANTS = [''] as const
type ColorVariant = (typeof COLOR_VARIANTS)[number]

function createProject(packageRoot: string, color: ColorVariant): ProjectConfig {
  const base = createCommonBuildConfig(packageRoot)
  const PROJECT_ID = `${PROJECT_KEY}${color}`

  return {
    ...base,

    name: PROJECT_ID,
    tags: [
      'おみくじBOT',
      'ユーザーリスト',
      'フライトシート',
      '卒業写真メーカー',
      'おみくじ',
      'BOT',
      'ブラウザゲーム',
      'ゲーム配信',
      '雑談配信',
      '朝活配信',
      'わんコメ',
      '初見歓迎',
      'コメントチェック',
      '初見判定ちゃん',
    ],

    license: {
      basic: '利用規約に従う',
      adv: '利用規約に従う',
      pro: '利用規約に従う',
    },

    template: {
      name: `おみくじ BOT ${PROJECT_TITLE}${color ? color + ' ' : ''}OmikujiBot ${PROJECT_ID}`,
      boothURL: `https://pintocuru.booth.pm/items/${boothURLNumber}`,
      readmeURL: `https://github.com/Pintocuru/OmikujiBot-Docs/tree/main/solo/${PROJECT_KEY}`,
      description: '配信者のためのコメントアプリ「わんコメ」で使用できる、ジェネレーターBOT',
    },

    json: createCommonBuildConfigJson(packageRoot, `${PROJECT_ID}.json`),

    accessLevels: {
      adv: {
        filesToCopy: [{ from: `assets/thumb/thumb_${PROJECT_ID}.gif`, to: 'thumb.gif' }],
      },
      pro: {
        filesToCopy: [{ from: `assets/thumb/thumb_${PROJECT_ID}.gif`, to: 'thumb.gif' }],
      },
    },
  }
}

// プロジェクト一覧
function getProjects(packageRoot: string): ProjectConfig[] {
  return COLOR_VARIANTS.map((color) => createProject(packageRoot, color))
}

// ビルドターゲット定義
const buildTargets: PackageBuildTarget[] = [
  { project: 'GraduationIcons', type: 'FULL', accessLevel: 'adv', sourceProject: 'OmikujiBotMain' },
  { project: 'GraduationIcons', type: 'FULL', accessLevel: 'pro', sourceProject: 'OmikujiBot' },
]

export default { getProjects, buildTargets }
