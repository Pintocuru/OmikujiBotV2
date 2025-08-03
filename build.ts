// templates/basicNew/build.ts
import path from 'path';
import { fileURLToPath } from 'url';
import { main } from '../../buildRoot/buildMain.ts';
import { BuildConfig } from '../../buildRoot/buildTypes.ts';
import { alias } from './vite.config.ts';

// ESModuleでの__dirname取得
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const packageRoot = path.resolve(__dirname);

// 共通設定
const entryPoints = {
 MainGenerator: path.resolve(packageRoot, 'src/MainGenerator/main.ts'),
 ConfigMaker: path.resolve(packageRoot, 'src/ConfigMaker/main.ts')
};
const addHtmlTemplate = `
 <!-- 設定ファイル -->
 <script src="./config.js" defer></script>
 <!-- おみくじデータ -->
 <script src="./omikujiData.js" defer></script>
 `;

/**
 * ビルド設定（production専用）
 */
const buildConfigs: Record<string, BuildConfig> = {
 ReimuMarisa: {
  templateJson: {
   name: 'おみくじBOT ゆっくり霊夢&魔理沙 OmikujiBot Reimu & Marisa(プレビュー版)',
   author: 'Pintocuru(せすじピンとしてます)',
   link: 'https://pintocuru.booth.pm/items/5471598',
   description: 'おみくじ付きBOTジェネレーター'
  },
  templateTxt: {
   packageName: 'おみくじBOT ゆっくり霊夢&魔理沙 OmikujiBot Reimu & Marisa(プレビュー版)',
   boothURL: 'https://pintocuru.booth.pm/items/5471598',
   description: '配信者のためのコメントアプリ「わんコメ」で使用できる、ジェネレーターBOT',
   readmeURL: 'https://github.com/pintocuru/OmikujiBot/blob/main/README.md'
  },
  filesToCopy: [
   'config.js',
   { from: 'OmikujiDatas/ReimuBasic-250720.js', to: 'omikujiData.js' },
   'readme.txt',
   { from: 'thumb.png', to: 'thumb.png' },
   'Characters/reimu/',
   'Characters/marisa/'
  ],
  packageRoot,
  entryPoints,
  alias,
  addHtmlTemplate
 }
};

// 実行
main(buildConfigs);
