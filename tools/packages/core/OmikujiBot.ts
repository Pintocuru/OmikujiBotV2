// tools/packages/core/OmikujiBot.ts
import path from 'path'
import { createCommonBuildConfig, defaultFilesToCopy } from '../../buildOptions/baseSettings'
import { ProjectConfig } from '@shared/utils/webpackBuild/BuildTypes'
import { APP_VERSION } from '@/version'

/**
 * MainGenerator + ConfigMaker の両方をビルドするコアプロジェクト
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

    // MainGenerator + ConfigMaker の両方をビルド
    entryPoints: {
      MainGenerator: path.resolve(packageRoot, 'src/MainGenerator/main.ts'),
      ConfigMaker: path.resolve(packageRoot, 'src/ConfigMaker/main.ts'),
    },

    template: null,
    json: undefined,

    accessLevels: {
      basic: {
        filesToCopy: [...defaultFilesToCopy, { from: 'assets/sounds/', to: 'assets/sounds/' }],
      },
    },
  }
}

export default project
