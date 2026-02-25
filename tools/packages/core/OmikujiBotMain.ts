// tools/packages/core/OmikujiBotMain.ts
import path from 'path'
import { createCommonBuildConfig } from '../../buildOptions/baseSettings'
import { ProjectConfig } from '@shared/utils/webpackBuild/BuildTypes'
import { APP_VERSION } from '@/version'

/**
 * MainGenerator のみをビルドするコアプロジェクト
 */
function project(packageRoot: string): ProjectConfig {
  return {
    ...createCommonBuildConfig(packageRoot),

    name: 'OmikujiBotMain',
    version: APP_VERSION,
    tags: ['おみくじBOT'],

    license: {
      basic: 'CC-BY 4.0',
    },

    // MainGenerator のみをビルド
    entryPoints: {
      MainGenerator: path.resolve(packageRoot, 'src/MainGenerator/main.ts'),
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
