// buildConfigs\EveryoneZunda.ts
import { ProjectConfig } from '@shared/utils/webpackBuild/buildTypes'
import { commonBuildConfig } from './base/baseSettings'

/**
 * ReimuMarisaプロジェクト設定
 */
const project: ProjectConfig = {
  ...commonBuildConfig,

  name: 'EveryoneZunda',
  version: 'v2025.8.27(プレビュー版)',

  template: {
    name: 'おみくじBOT みんなのずんだもん OmikujiBot EveryoneZunda',
    boothURL: 'https://pintocuru.booth.pm/items/6053855',
    readmeURL: 'https://github.com/Pintocuru/OmikenReadme/blob/main/docs/OmikujiBotEveryoneZunda/README.md',
    description: '配信者のためのコメントアプリ「わんコメ」で使用できる、ジェネレーターBOT',
  },

  json: {
    ...commonBuildConfig.json,
    jsonPath: 'EveryoneZunda.json',
  },

  // アクセスレベル別設定
  accessLevels: {
    basic: {
      filesToCopy: [
        { from: 'assets/config.js', to: 'config.js' },
        { from: 'assets/exported/thumb/EveryoneZunda.png', to: 'thumb.png' },
        { from: 'assets/exported/Characters/zunda/', to: 'Characters/zunda/' },
      ],
      skipWebpack: false,
      outputJson: false,
    },
    pro: {
      filesToCopy: [{ from: 'assets/exported/thumb/ReimuMarisaDX.png', to: 'thumb.png' }],
      skipWebpack: true,
      outputJson: true,
    },
  },
}

export default project
