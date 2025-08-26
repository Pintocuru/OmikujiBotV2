// buildConfigs/ReimuMarisa.ts (新形式)
import { ProjectConfig } from '@shared/utils/webpackBuild/buildTypes'
import { commonBuildConfig } from './base/baseSettings'

/**
 * ReimuMarisaプロジェクト設定
 */
const reimuMarisaProject: ProjectConfig = {
  ...commonBuildConfig,

  name: 'ReimuMarisa',
  version: 'v2025.8.25(プレビュー版)',

  template: {
    name: 'おみくじBOT ゆっくり霊夢&魔理沙 OmikujiBot ReimuMarisa',
    boothURL: 'https://pintocuru.booth.pm/items/5471598',
    readmeURL: 'https://github.com/Pintocuru/OmikenReadme/blob/main/docs/OmikujiBotReimuMarisa/README.md',
    description: '配信者のためのコメントアプリ「わんコメ」で使用できる、ジェネレーターBOT',
  },

  json: {
    ...commonBuildConfig.json,
    jsonPath: 'ReimuMarisa.json',
  },

  // アクセスレベル別設定
  accessLevels: {
    basic: {
      filesToCopy: [
        { from: 'assets/config.js', to: 'config.js' },
        { from: 'assets/exported/thumb/ReimuMarisaDX.png', to: 'thumb.png' },
        { from: 'assets/exported/Characters/reimu/', to: 'Characters/reimu/' },
        { from: 'assets/exported/Characters/marisa/', to: 'Characters/marisa/' },
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

export default reimuMarisaProject
