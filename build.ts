// build.ts
import { webpackBuild } from '../../buildRoot/buildMain.ts';
import { RecordBuildConfig, CommonBuildData } from '../../buildRoot/buildTypes.ts';
import { alias } from './vite.config.ts';
import packageJson from './package.json';

// 各設定ファイルをインポート
import ReimuMarisaConfig from './buildConfigs/ReimuMarisa_v0.8.0.ts';

// 共通データ
const commonData: CommonBuildData = {
 alias,
 author: packageJson.author,
 description: packageJson.description
};

// 各設定を統合
const buildConfigs: RecordBuildConfig = {
 [ReimuMarisaConfig.configKey]: ReimuMarisaConfig
 // [OtherVariantConfig.configKey]: OtherVariantConfig.buildConfig,
};

// 実行
webpackBuild(buildConfigs, commonData);
