// tools/packages/petit/BreakingSyoken.ts
import { createCommonBuildConfig, createCommonBuildConfigJson } from '../../buildOptions/baseSettings'
import { PackageBuildTarget, ProjectConfig } from '@shared/utils/webpackBuild/BuildTypes'

const PROJECT_KEY = 'BreakingSyoken'
const PROJECT_TITLE = '速報！初見さんいらっしゃい！'
const boothURLNumber = '7982286'

// カラーバリエーション定義
// PROJECT_COLOR が '' の場合はデフォルト（無印）扱い
const COLOR_VARIANTS = ['', 'Red', 'Blue', 'Green', 'Yellow', 'Premium'] as const
type ColorVariant = (typeof COLOR_VARIANTS)[number]

function createProject(packageRoot: string, color: ColorVariant): ProjectConfig {
  const base = createCommonBuildConfig(packageRoot)
  const PROJECT_ID = `${PROJECT_KEY}${color}`

  return {
    ...base,

    name: PROJECT_ID, // カラバリごとに name を分ける
    tags: [
      'おみくじBOT',
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
      basic: 'CC-BY 4.0',
    },

    template: {
      name: `おみくじ BOT ${PROJECT_TITLE} ${color ? color + ' ' : ''}OmikujiBot ${PROJECT_ID}`,
      boothURL: `https://pintocuru.booth.pm/items/${boothURLNumber}`,
      readmeURL: `https://github.com/Pintocuru/OmikujiBot-Docs/tree/main/petit/${PROJECT_KEY}`,
      description: '配信者のためのコメントアプリ「わんコメ」で使用できる、ジェネレーターBOT',
    },

    json: createCommonBuildConfigJson(packageRoot, `${PROJECT_ID}.json`),

    accessLevels: {
      basic: {
        filesToCopy: [{ from: `assets/exported/thumb/thumb_${PROJECT_ID}.gif`, to: 'thumb.gif' }],
      },
      adv: {
        filesToCopy: [{ from: `assets/exported/thumb/thumb_${PROJECT_ID}.gif`, to: 'thumb.gif' }],
      },
      pro: {
        filesToCopy: [{ from: `assets/exported/thumb/thumb_${PROJECT_ID}.gif`, to: 'thumb.gif' }],
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
  { project: 'BreakingSyoken', type: 'FULL', accessLevel: 'basic', sourceProject: 'OmikujiBot' },
  { project: 'BreakingSyoken', type: 'JSON', accessLevel: 'basic' },
  { project: 'BreakingSyokenRed', type: 'FULL', accessLevel: 'adv', sourceProject: 'OmikujiBot' },
  { project: 'BreakingSyokenRed', type: 'JSON', accessLevel: 'basic' },
  { project: 'BreakingSyokenBlue', type: 'FULL', accessLevel: 'adv', sourceProject: 'OmikujiBot' },
  { project: 'BreakingSyokenBlue', type: 'JSON', accessLevel: 'basic' },
  { project: 'BreakingSyokenGreen', type: 'FULL', accessLevel: 'adv', sourceProject: 'OmikujiBot' },
  { project: 'BreakingSyokenGreen', type: 'JSON', accessLevel: 'basic' },
  { project: 'BreakingSyokenYellow', type: 'FULL', accessLevel: 'adv', sourceProject: 'OmikujiBot' },
  { project: 'BreakingSyokenYellow', type: 'JSON', accessLevel: 'basic' },
  { project: 'BreakingSyokenPremium', type: 'FULL', accessLevel: 'pro', sourceProject: 'OmikujiBot' },
  { project: 'BreakingSyokenPremium', type: 'JSON', accessLevel: 'basic' },
]

export default { getProjects, buildTargets }
