// tools/packages/solo/MyNineViewers.ts
import { createCommonBuildConfig, createCommonBuildConfigJson } from '../../buildOptions/baseSettings'
import { PackageBuildTarget, ProjectConfig } from '@shared/utils/webpackBuild/BuildTypes'

const PROJECT_KEY = 'MyNineViewers'
const PROJECT_TITLE = 'おみくじ BOT 私を構成する 9 人のユーザー。'
const boothURLNumber = '8060471'

// バリエーション定義  '' の場合はデフォルト（無印）扱い
const COLOR_VARIANTS = ['', 'Adv', 'Pro'] as const
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
      name: `おみくじ BOT ${PROJECT_TITLE} ${color ? color + ' ' : ''}OmikujiBot ${PROJECT_ID}`,
      boothURL: `https://pintocuru.booth.pm/items/${boothURLNumber}`,
      readmeURL: `https://github.com/Pintocuru/OmikujiBot-Docs/tree/main/solo/${PROJECT_KEY}`,
      description: '配信者のためのコメントアプリ「わんコメ」で使用できる、ジェネレーターBOT',
    },

    json: createCommonBuildConfigJson(packageRoot, `${PROJECT_ID}.json`),

    accessLevels: {
      basic: {
        filesToCopy: [{ from: `assets/thumb/thumb_${PROJECT_ID}.gif`, to: 'thumb.gif' }],
      },
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
  { project: 'MyNineViewers', type: 'FULL', accessLevel: 'basic', sourceProject: 'OmikujiBotMain' },
  { project: 'MyNineViewers', type: 'JSON', accessLevel: 'basic' },
  { project: 'MyNineViewersAdv', type: 'FULL', accessLevel: 'adv', sourceProject: 'OmikujiBot' },
  { project: 'MyNineViewersPro', type: 'FULL', accessLevel: 'pro', sourceProject: 'OmikujiBot' },
]

export default { getProjects, buildTargets }
