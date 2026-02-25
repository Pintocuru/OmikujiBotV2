// tools/packages/solo/FlowerFortune.ts
import { createCommonBuildConfig } from '../../buildOptions/baseSettings'
import { ProjectConfig } from '@shared/utils/webpackBuild/BuildTypes'

const PROJECT_KEY = 'FlowerFortune'
const PROJECT_TITLE = 'フラワー占い'
const boothURLNumber = '7982286'

function project(packageRoot: string): ProjectConfig {
  const base = createCommonBuildConfig(packageRoot)

  return {
    ...base,

    name: PROJECT_KEY,
    tags: ['おみくじBOT', 'BOT', 'フラワー占い', 'おみくじ'],

    license: {
      basic: 'CC-BY 4.0',
    },

    template: {
      name: `おみくじ BOT ${PROJECT_TITLE} OmikujiBot ${PROJECT_KEY}`,
      boothURL: `https://pintocuru.booth.pm/items/${boothURLNumber}`,
      readmeURL: `https://github.com/Pintocuru/OmikujiBot-Docs/tree/main/petit/${PROJECT_KEY}`,
      description: '配信者のためのコメントアプリ「わんコメ」で使用できる、ジェネレーターBOT',
    },

    json: {
      ...base.json,
      jsonPath: `${PROJECT_KEY}.json`,
    },

    accessLevels: {
      basic: {
        filesToCopy: [
          // { from: `assets/exported/thumb/thumb_${PROJECT_KEY}.gif`, to: 'thumb.gif' },
        ],
      },
    },
  }
}

export default project
