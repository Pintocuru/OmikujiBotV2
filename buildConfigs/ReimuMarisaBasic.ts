// buildConfigs/ReimuMarisaBasic.ts
import { commonBuildConfig } from './base/baseSettings'
import { AccessLevelType } from '@shared/types/CommonSchema'
import { BuildConfig } from '@shared/utils/webpackBuild/buildTypes'

/**
 * おみくじBOT ゆっくり霊夢&魔理沙 のビルド設定
 */
const name = 'ReimuMarisa'
const version = '2025.8.24(ベータ版)'
const targetAccessLevel = 'basic' as AccessLevelType

// テンプレートネームの後に付くもの
const accessName = targetAccessLevel === 'basic' ? 'basic' : targetAccessLevel === 'pro' ? 'PRO' : 'GOD-MODE'
const buildConfig: BuildConfig = {
  ...commonBuildConfig, // 共通項目

  // テンプレート情報（わんコメ用）
  template: {
    name: `おみくじBOT ゆっくり霊夢&魔理沙 OmikujiBot ${name} ${version} ${accessName}`,
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
  filesToCopy: [{ from: 'assets/exported/thumb/ReimuMarisaDX.png', to: 'thumb.png' }],

  name,
  version,
  skipWebpack: targetAccessLevel !== 'basic',
  outputJson: targetAccessLevel !== 'basic',
}

export default buildConfig
