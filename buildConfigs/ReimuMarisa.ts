// buildConfigs/ReimuMarisa.ts
import { BuildConfig } from '@shared/utils/webpackBuild/buildTypes'
import { commonBuildConfig } from './base/baseSettings'
import { AccessLevelType } from '@shared/types/CommonSchema'

/**
 * おみくじBOT ゆっくり霊夢&魔理沙 のビルド設定
 */
const name = 'ReimuMarisa'
const version = '2025.8.24(ベータ版)'
const targetAccessLevel: AccessLevelType = 'pro'

const buildConfig: BuildConfig = {
  ...commonBuildConfig, // 共通項目
  // プロジェクト識別情報
  name,
  version,

  // テンプレート情報（わんコメ用）
  template: {
    name: `おみくじBOT ゆっくり霊夢&魔理沙 OmikujiBot ${name} ${version}`,
    boothURL: 'https://pintocuru.booth.pm/items/5471598',
    readmeURL: 'https://github.com/pintocuru/OmikujiBot/blob/main/README.md',
    description: '配信者のためのコメントアプリ「わんコメ」で使用できる、ジェネレーターBOT',
  },

  // JSON設定（おみくじデータ）
  json: {
    ...commonBuildConfig.json,
    jsonPath: 'ReimuMarisa.json',
    targetAccessLevel,
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
