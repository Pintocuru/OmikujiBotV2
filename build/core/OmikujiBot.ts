// build/core/OmikujiBot.ts
import path from 'path'
import { createCoreBuildConfig, DEFAULT_FILES_TO_COPY } from '../../tools/buildOptions/baseSettings'
import { ProjectConfig } from '@shared/utils/webpackBuild/BuildTypes'
import { APP_VERSION } from '@/version'

/**
 * MainGenerator + ConfigMaker の両方をビルドするコアプロジェクト
 */
function project(packageRoot: string): ProjectConfig {
  return {
    ...createCoreBuildConfig(packageRoot),

    key: 'OmikujiBot',
    name: 'おみくじBOT',
    version: APP_VERSION,
    tags: ['おみくじBOT'],
    licenseLabel: 'にゃーん',

    // MainGenerator + ConfigMaker の両方をビルド
    entryPoints: {
      MainGenerator: path.resolve(packageRoot, 'src/MainGenerator/main.ts'),
      ConfigMaker: path.resolve(packageRoot, 'src/ConfigMaker/main.ts'),
    },

    template: null,
    json: undefined,

    filesToCopy: [...DEFAULT_FILES_TO_COPY, { from: 'assets/sounds/core/', to: 'assets/sounds/' }],
  }
}

export default {
  getProjects: (root: string) => [project(root)],
  buildTargets: [],
}
