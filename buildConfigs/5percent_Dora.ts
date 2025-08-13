// buildConfigs/ReimuMarisa_v0.8.0.ts
import { BuildConfig } from '../../../buildRoot/buildTypes';
import { commonBuildConfig } from './base/baseSettings';

/**
 * おみくじBOT ゆっくり霊夢&魔理沙 のビルド設定
 */
const buildConfig: BuildConfig = {
 ...commonBuildConfig, // 共通項目
 // プロジェクト識別情報
 name: '5percent_Dora',
 version: '1.0.0',

 // テンプレート情報（わんコメ用）
 template: {
  name: 'どこでもドラちゃんBot 1.0.0',
  boothURL: 'https://pintocuru.booth.pm/items/5471598',
  readmeURL: 'https://github.com/pintocuru/OmikujiBot/blob/main/README.md',
  description: '「わんコメ」で使用できる、ジェネレーターBOT'
 },

 // JSON設定（おみくじデータ）
 json: {
  ...commonBuildConfig.json,
  jsonPath: '5percent_Dora250810.json'
 },

 // リソースファイル
 filesToCopy: [
  { from: 'assets/config.js', to: 'config.js' },
  { from: 'assets/thumb/ReimuMarisaDX.png', to: 'thumb.png' },
  { from: 'assets/Characters/5percent_Dora/', to: 'Characters/5percent_Dora/' }
 ]
};

export default buildConfig;
