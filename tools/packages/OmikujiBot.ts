// tools\packages\OmikujiBot.ts
import { ProjectConfig } from '@shared/utils/webpackBuild/BuildTypes'
import { createCommonBuildConfig } from '../buildOptions/baseSettings'
import { APP_VERSION } from '@/config/version'

/**
 * プロジェクト設定
 */
function project(packageRoot: string): ProjectConfig {
  return {
    ...createCommonBuildConfig(packageRoot),

    name: 'OmikujiBot',
    version: APP_VERSION,
    tags: ['おみくじBOT'],

    license: {
      basic: 'CC-BY 4.0',
    },

    template: null,
    json: undefined,

    // アクセスレベル別設定
    accessLevels: {
      basic: {
        filesToCopy: [],
        skipWebpack: false,
        outputJson: false,
      },
    },
  }
}

export default project
