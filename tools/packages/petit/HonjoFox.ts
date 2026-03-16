// tools/packages/petit/HonjoFox.ts
import { createCommonBuildConfig } from '../../buildOptions/baseSettings'
import { ProjectConfig } from '@shared/utils/webpackBuild/BuildTypes'

const PROJECT_KEY = 'HonjoFox'
const PROJECT_TITLE = '中仙道の村きつね'
const boothURLNumber = '7982286'

function project(packageRoot: string): ProjectConfig {
  const base = createCommonBuildConfig(packageRoot)

  return {
    ...base,

    name: PROJECT_KEY,
    tags: ['おみくじBOT', 'BOT', PROJECT_TITLE, 'コメントチェック', '初見判定ちゃん'],

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
          { from: `assets/thumb/thumb_${PROJECT_KEY}.gif`, to: 'thumb.gif' },
          { from: `assets/Characters/${PROJECT_KEY}/`, to: `Characters/${PROJECT_KEY}/` },
        ],
      },
    },
  }
}

export default project
