// tools\packages\OmikujiBot.ts
// MainGenerator + ConfigMaker の両方をビルドするコアプロジェクト
import { ProjectConfig } from '@shared/utils/webpackBuild/BuildTypes'
import { createCommonBuildConfig } from '../buildOptions/baseSettings'
import { APP_VERSION } from '@/version'
import path from 'path'

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
        filesToCopy: [],
      },
    },
  }
}

export default project
