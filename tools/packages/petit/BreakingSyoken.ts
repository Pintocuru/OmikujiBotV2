// tools/packages/solo/BreakingSyoken.ts
import { createCommonBuildConfig } from '../../buildOptions/baseSettings'
import { ProjectConfig } from '@shared/utils/webpackBuild/BuildTypes'

const PROJECT_KEY = 'BreakingSyoken'
const PROJECT_COLOR = ''
const PROJECT_ID = `${PROJECT_KEY}${PROJECT_COLOR}`
const PROJECT_TITLE = '速報！初見さんいらっしゃい！'
const boothURLNumber = '7982286'

function project(packageRoot: string): ProjectConfig {
  const base = createCommonBuildConfig(packageRoot)

  return {
    ...base,

    name: PROJECT_KEY,
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
      name: `おみくじ BOT ${PROJECT_TITLE} ${PROJECT_COLOR ? PROJECT_COLOR + ' ' : ''}OmikujiBot ${PROJECT_ID}`,
      boothURL: `https://pintocuru.booth.pm/items/${boothURLNumber}`,
      readmeURL: `https://github.com/Pintocuru/OmikujiBot-Docs/tree/main/petit/${PROJECT_KEY}`,
      description: '配信者のためのコメントアプリ「わんコメ」で使用できる、ジェネレーターBOT',
    },

    json: {
      ...base.json,
      jsonPath: `${PROJECT_ID}.json`,
    },

    accessLevels: {
      basic: {
        filesToCopy: [{ from: `assets/exported/thumb/thumb_${PROJECT_ID}.gif`, to: 'thumb.gif' }],
      },
    },
  }
}

export default project
