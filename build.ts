// build.ts
import { WebpackBuilder } from '../../buildRoot/buildMain.ts';
import { RecordBuildConfig, SystemCommonData } from '../../buildRoot/buildTypes.ts';
import { alias } from './vite.config.ts';
import packageJson from './package.json';
import { createShimsVue } from './tools/CreateOmikujiData.ts';

// 各設定ファイルをインポート
import ReimuMarisaConfig from './buildConfigs/ReimuMarisa_v0.8.0.ts';

// システム共通データ
const systemCommonData: SystemCommonData = {
 alias,
 author: packageJson.author,
 description: packageJson.description,
 generatorName: packageJson.name,
 generatorVersion: packageJson.version
};

// ビルド設定を統合
const buildConfigs: RecordBuildConfig = {
 [ReimuMarisaConfig.configKey]: ReimuMarisaConfig
};

// ビルド実行
(async () => {
 try {
  // 並行で実行
  createShimsVue();

  const builder = new WebpackBuilder(systemCommonData);
  await builder.build(buildConfigs);

  console.log('[Build] All builds completed successfully!');
 } catch (error) {
  console.error('[Build] Build failed:', error);
  process.exit(1);
 }
})();
