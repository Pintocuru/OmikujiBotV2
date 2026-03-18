// tools/packages/solo/TarotCard.ts
import { createCommonBuildConfig } from '../../buildOptions/baseSettings'
import { APP_VERSION, BUILD_DATE } from '@/version'
import { ProjectConfig } from '@shared/utils/webpackBuild/BuildTypes'

/**
 * プロジェクト設定
 */
function project(packageRoot: string): ProjectConfig {
  return {
    ...createCommonBuildConfig(packageRoot),

    name: 'TarotCard',
    version: `${BUILD_DATE}-${APP_VERSION}`,
    tags: ['おみくじBOT', '占い', 'Fortune', 'タロット', 'tarot'],
    banner:
      'https://raw.githubusercontent.com/Pintocuru/OmikujiBot-Docs/refs/heads/main/solo/TarotCard/thumb_TarotCard.gif',

    license: {
      basic: 'CC-BY 4.0',
    },

    template: {
      name: 'おみくじ BOT タロットカード OmikujiBot TarotCard',
      boothURL: 'https://pintocuru.booth.pm/items/7432682',
      readmeURL: 'https://github.com/Pintocuru/OmikujiBot-Docs/blob/main/solo/TarotCard/README.md',
      description: '配信者のためのコメントアプリ「わんコメ」で使用できる、ジェネレーターBOT',
    },

    json: {
      ...createCommonBuildConfig(packageRoot).json,
      jsonPath: 'TarotCard.json',
    },

    // アクセスレベル別設定
    accessLevels: {
      basic: {
        filesToCopy: [{ from: 'assets/thumb/thumb_TarotCard.gif', to: 'thumb.gif' }],
      },
    },
  }
}

export default project
