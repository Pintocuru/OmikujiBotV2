// buildConfigs/ReimuMarisa_v0.8.0.ts
import { BuildConfig } from '@shared/utils/webpackBuild/buildTypes'
import { commonBuildConfig } from './base/baseSettings'

/**
 * おみくじBOT ゆっくり霊夢&魔理沙 のビルド設定
 */
const buildConfig: BuildConfig = {
  ...commonBuildConfig, // 共通項目
  // プロジェクト識別情報
  name: 'ReimuMarisa',
  version: '0.8.0-beta06',

  // テンプレート情報（わんコメ用）
  template: {
    name: 'おみくじBOT ゆっくり霊夢&魔理沙 OmikujiBot Reimu & Marisa(プレビュー版) 0.8.0-beta06',
    boothURL: 'https://pintocuru.booth.pm/items/5471598',
    readmeURL: 'https://github.com/pintocuru/OmikujiBot/blob/main/README.md',
    description: '配信者のためのコメントアプリ「わんコメ」で使用できる、ジェネレーターBOT',
  },

  // JSON設定（おみくじデータ）
  json: {
    ...commonBuildConfig.json,
    jsonPath: 'ReimuDX-250724.json',
  },

  // リソースファイル
  filesToCopy: [
    { from: 'assets/config.js', to: 'config.js' },
    { from: 'assets/exported/thumb/ReimuMarisaDX.png', to: 'thumb.png' },
    { from: 'assets/exported/Characters/reimu/', to: 'Characters/reimu/' },
    { from: 'assets/exported/Characters/marisa/', to: 'Characters/marisa/' },
  ],
}

export default buildConfig
