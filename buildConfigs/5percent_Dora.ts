// buildConfigs\5percent_Dora.ts
import { BuildConfig } from '@shared/utils/webpackBuild/buildTypes'
import { commonBuildConfig } from './base/baseSettings'

/**
 * おみくじBOT ゆっくり霊夢&魔理沙 のビルド設定
 */
const buildConfig: BuildConfig = {
  ...commonBuildConfig, // 共通項目
  // プロジェクト識別情報
  name: '5percent_Dora',
  version: '2025.8.16',

  // テンプレート情報（わんコメ用）
  template: {
    name: 'どこでもドラちゃんBot 2025.8.16',
    boothURL: 'https://pintocuru.booth.pm/items/7291931',
    readmeURL: 'https://github.com/Pintocuru/OmikenReadme/blob/main/docs/OmikujiBot5percent_Dora/README.md',
    description: '配信者のためのコメントアプリ「わんコメ」で使用できる、ジェネレーターBOT',
  },

  // JSON設定（おみくじデータ）
  json: {
    ...commonBuildConfig.json,
    jsonPath: '5percent_Dora250810.json',
  },

  // リソースファイル
  filesToCopy: [
    { from: 'assets/config.js', to: 'config.js' },
    { from: 'assets/exported/thumb/5percent_Dora.gif', to: 'thumb.gif' },
    { from: 'assets/exported/Characters/5percent_Dora/', to: 'Characters/5percent_Dora/' },
  ],
}

export default buildConfig
