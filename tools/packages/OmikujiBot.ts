// tools\packages\OmikujiBot.ts
import { ProjectConfig } from '@shared/utils/webpackBuild/buildTypes'
import { createCommonBuildConfig } from '../buildOptions/baseSettings'

/**
 * プロジェクト設定
 */
function project(packageRoot: string): ProjectConfig {
  return {
    ...createCommonBuildConfig(packageRoot),

    name: 'OmikujiBot',
    version: 'v2025.9.8',
    tags: ['おみくじBOT'],

    license: {
      basic: 'CC-BY 4.0',
    },

    template: null,
    json: undefined,

    // アクセスレベル別設定
    accessLevels: {
      basic: {
        filesToCopy: [{ from: 'assets/config.js', to: 'config.js' }],
        skipWebpack: false,
        outputJson: false,
      },
    },
  }
}

export default project
