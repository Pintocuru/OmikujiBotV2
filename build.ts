// build.ts
import { webpackBuild } from '../../buildRoot/buildMain.ts';
import { RecordBuildConfig, CommonBuildData } from '../../buildRoot/buildTypes.ts';
import { alias } from './vite.config.ts';
import packageJson from './package.json';

// 各設定ファイルをインポート
import ReimuMarisaConfig from './buildConfigs/ReimuMarisa_v0.8.0.ts';
import { createShimsVue } from './tools/CreateOmikujiData.ts';

// 共通データ
const commonData: CommonBuildData = {
 alias,
 author: packageJson.author,
 description: packageJson.description,
 generatorName: packageJson.name,
 generatorVersion: packageJson.version
};

// 各設定を統合
const buildConfigs: RecordBuildConfig = {
 [ReimuMarisaConfig.configKey]: ReimuMarisaConfig
 // [OtherVariantConfig.configKey]: OtherVariantConfig.buildConfig,
};

(async () => {
 // 並行で実行
 createShimsVue();
 webpackBuild(buildConfigs, commonData);
})();
