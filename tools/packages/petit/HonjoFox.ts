// tools\packages\solo\HonjoFox.ts
import { createCommonBuildConfig } from '../../buildOptions/baseSettings'
import { APP_VERSION, BUILD_DATE } from '@/version'
import { ProjectConfig } from '@shared/utils/webpackBuild/BuildTypes'

/**
 * プロジェクト設定
 */
function project(packageRoot: string): ProjectConfig {
  return {
    ...createCommonBuildConfig(packageRoot),

    name: 'HonjoFox',
    version: `${BUILD_DATE}-${APP_VERSION}`,
    tags: ['おみくじBOT', 'リスト表示', 'winner', 'カップル', 'カップリング'],

    license: {
      basic: 'CC-BY 4.0',
    },

    template: {
      name: 'おみくじ BOT 中仙道の村きつね OmikujiBot HonjoFox',
      boothURL: 'https://pintocuru.booth.pm/items/7982286',
      readmeURL: 'https://github.com/Pintocuru/OmikujiBot-Docs/tree/main/petit/HonjoFox',
      description: '配信者のためのコメントアプリ「わんコメ」で使用できる、ジェネレーターBOT',
    },

    json: {
      ...createCommonBuildConfig(packageRoot).json,
      jsonPath: 'HonjoFox.json',
    },

    // アクセスレベル別設定
    accessLevels: {
      basic: {
        filesToCopy: [{ from: 'assets/exported/thumb/thumb_HonjoFox.gif', to: 'thumb.gif' }],
      },
    },
  }
}

export default project
