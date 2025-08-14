// build.ts
import { WebpackBuilder } from '@shared/utils/webpackBuild/buildMain.ts';
import { BuildConfig, SystemCommonData } from '@shared/utils/webpackBuild/buildTypes.ts';
import { alias } from './vite.config';
import packageJson from './package.json';

// 各設定ファイルをインポート
import ReimuMarisaConfig from './buildConfigs/ReimuMarisa_v0.8.0';
import { createShimsVue } from './tools/CreateOmikujiData';

// システム共通データ
const systemCommonData: SystemCommonData = {
 alias,
 author: packageJson.author,
 description: packageJson.description,
 generatorName: packageJson.name,
 generatorVersion: packageJson.version
};

/**
 * ビルド設定リスト
 *
 * 各設定は以下の情報を持つ：
 * - プロジェクト名とバージョン
 * - エントリーポイント（複数可）
 * - テンプレート情報（Booth URL、説明文など）
 * - 必要に応じてJSON設定
 *
 * 出力フォルダ名: {name}_{version}
 */
const buildConfigs: BuildConfig[] = [
 ReimuMarisaConfig
 // 新しい設定はここに追加
 // AnotherBotConfig,
 // YetAnotherBotConfig
];

// ビルド実行
(async () => {
 try {
  // 前処理
  createShimsVue();

  // メインビルド処理
  const builder = new WebpackBuilder(systemCommonData);
  await builder.build(buildConfigs);

  console.log('[Build] All builds completed successfully!');
 } catch (error) {
  console.error('[Build] Build failed:', error);
  process.exit(1);
 }
})();
