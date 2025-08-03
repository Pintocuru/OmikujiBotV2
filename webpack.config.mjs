// [packages] webpack.config.mjs
// @ts-check
import { createConfig, createCommonPlugins, createCommonResolve } from '../../webpack.config.mjs';
import path from 'path';
import { fileURLToPath } from 'url';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';

// ---

const dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * @typedef {Object} EntryPoints
 * @property {string} MainGenerator - MainGeneratorのエントリーポイント
 * @property {string} ConfigMaker - ConfigMakerのエントリーポイント
 */

/**
 * Webpackのエントリーポイントを作成
 * @param {string} dirname - 現在のディレクトリパス
 * @returns {EntryPoints} エントリーポイント設定オブジェクト
 */
function createEntries(dirname) {
 return {
  MainGenerator: path.resolve(dirname, `./src/MainGenerator/main.ts`),
  ConfigMaker: path.resolve(dirname, `./src/ConfigMaker/main.ts`)
 };
}

/**
 * HtmlWebpackPluginのインスタンス配列を作成
 * @param {string} dirname - 現在のディレクトリパス
 * @returns {HtmlWebpackPlugin[]} HtmlWebpackPluginインスタンス配列
 */
function createHtmlPlugins(dirname) {
 return [
  // 本体:MainGenerator
  new HtmlWebpackPlugin({
   template: path.resolve(dirname, `./src/MainGenerator/index.pug`),
   templateParameters: {},
   filename: `index.html`,
   chunks: ['MainGenerator'],
   inject: 'body'
  }),
  // ConfigMaker
  new HtmlWebpackPlugin({
   template: path.resolve(dirname, `./src/ConfigMaker/index.pug`),
   templateParameters: {},
   filename: `ConfigMaker.html`,
   chunks: ['ConfigMaker'],
   inject: 'body'
  })
 ];
}

/**
 * CopyWebpackPluginのパターン配列を作成
 * @param {string} dirname - 現在のディレクトリパス
 * @returns {import('copy-webpack-plugin').ObjectPattern[]} コピーパターン配列
 */
function createCopyPatterns(dirname) {
 return [
  // TailwindCSS
  //  {
  //  from: path.resolve(dirname, `./assets/app.css`),
  //  to: path.resolve(dirname, `dist/scripts/app.css`)
  // },
  // おみくじを適用するConfig
  {
   from: path.resolve(dirname, `./assets/config.js`),
   to: path.resolve(dirname, `dist/config.js`)
  },
  // おみくじデータConfig
  {
   from: path.resolve(dirname, `./assets/omikujiData.js`),
   to: path.resolve(dirname, `dist/omikujiData.js`)
  },
  // readme
  {
   from: path.resolve(dirname, `./assets/readme.txt`),
   to: path.resolve(dirname, `dist/readme.txt`)
  },
  // わんコメのテンプレート用情報
  {
   from: path.resolve(dirname, `./assets/template.json`),
   to: path.resolve(dirname, `dist/template.json`)
  },
  // わんコメのテンプレート用サムネイル
  {
   from: path.resolve(dirname, `./assets/thumb.png`),
   to: path.resolve(dirname, `dist/thumb.png`)
  },
  // Charactersフォルダ
  {
   from: path.resolve(dirname, `./assets/Characters`),
   to: path.resolve(dirname, `./dist/Characters`)
  }
 ];
}

/**
 * CSSローダールールを作成（style-loader使用版）
 * @returns {import('webpack').RuleSetRule} CSSローダールール
 */
function createCssLoaderRule() {
 return {
  test: /\.css$/,
  use: ['style-loader', 'css-loader', 'postcss-loader']
 };
}

/**
 * モジュールルール配列を更新（CSSルールを置き換え）
 * @param {import('webpack').RuleSetRule[]} baseRules - ベースとなるルール配列
 * @param {import('webpack').RuleSetRule} newCssRule - 新しいCSSルール
 * @returns {import('webpack').RuleSetRule[]} 更新されたルール配列
 */
function updateModuleRules(baseRules, newCssRule) {
 return baseRules.map((rule) =>
  rule.test && rule.test.toString() === /\.css$/.toString() ? newCssRule : rule
 );
}

/**
 * エイリアス設定を拡張
 * @param {string} dirname - 現在のディレクトリパス
 * @param {import('webpack').ResolveOptions['alias']} baseAlias - ベースのエイリアス設定
 * @returns {import('webpack').ResolveOptions['alias']} 拡張されたエイリアス設定
 */
function createExtendedAlias(dirname, baseAlias) {
 return {
  ...baseAlias,
  '@type': path.resolve(dirname, 'src/types/types.ts'),
  '@assets': path.resolve(dirname, 'assets'),
  '@': path.resolve(dirname, 'src'),
  '@Config': path.resolve(dirname, 'src/ConfigMaker'),
  '@ConfigComponents': path.resolve(dirname, 'src/ConfigMaker/components'),
  '@ConfigScript': path.resolve(dirname, 'src/ConfigMaker/script'),
  '@ConfigStore': path.resolve(dirname, 'src/ConfigMaker/store')
 };
}

/**
 * Webpack設定のデフォルトエクスポート関数
 * @returns {import('webpack').Configuration} Webpack設定オブジェクト
 */
export default () => {
 const baseConfig = createConfig(dirname, false);
 const commonResolve = createCommonResolve();

 const entries = createEntries(dirname);
 const htmlPlugins = createHtmlPlugins(dirname);
 const copyPatterns = createCopyPatterns(dirname);
 const cssLoaderRule = createCssLoaderRule();

 // baseConfig から rules を取得し、CSS ルールを置き換える
 // @ts-ignore baseConfigは必ず設定してある
 const rules = updateModuleRules(baseConfig.module.rules, cssLoaderRule);

 return {
  ...baseConfig,
  entry: entries,
  output: {
   filename: `scripts/[name].js`,
   path: path.resolve(dirname, `dist`),
   clean: true
  },
  resolve: {
   ...commonResolve,
   alias: createExtendedAlias(dirname, commonResolve.alias)
  },
  module: {
   ...baseConfig.module,
   rules: rules
  },
  externals: {
   vue: 'Vue'
  },
  plugins: [
   ...createCommonPlugins(),
   ...htmlPlugins,
   new CopyWebpackPlugin({ patterns: copyPatterns })
  ]
 };
};
