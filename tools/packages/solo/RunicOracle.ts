// tools\packages\solo\RunicOracle.ts
import { createCommonBuildConfig } from '../../buildOptions/baseSettings'
import { APP_VERSION, BUILD_DATE } from '@/version'
import { ProjectConfig } from '@shared/utils/webpackBuild/BuildTypes'

/**
 * プロジェクト設定
 */
function project(packageRoot: string): ProjectConfig {
  return {
    ...createCommonBuildConfig(packageRoot),

    name: 'RunicOracle',
    version: `${BUILD_DATE}-${APP_VERSION}`,
    tags: ['おみくじBOT', '占い', 'Fortune', 'ルーン', 'rune', 'runic'],

    license: {
      basic: 'CC-BY 4.0',
    },

    template: {
      name: 'おみくじ BOT タロットカード OmikujiBot RunicOracle',
      boothURL: 'https://pintocuru.booth.pm/items/7432682',
      readmeURL: 'https://github.com/Pintocuru/OmikujiBot-Docs/blob/main/solo/RunicOracle/README.md',
      description: '配信者のためのコメントアプリ「わんコメ」で使用できる、ジェネレーターBOT',
    },

    json: {
      ...createCommonBuildConfig(packageRoot).json,
      jsonPath: 'RunicOracle.json',
    },

    // アクセスレベル別設定
    accessLevels: {
      basic: {
        filesToCopy: [{ from: 'assets/exported/thumb/thumb_RunicOracle.gif', to: 'thumb.gif' }],
      },
    },
  }
}

export default project
