// templates/basicNew/build.ts
import path from 'path';
import { fileURLToPath } from 'url';
import { main } from '../../buildRoot/buildMain.ts';
import { BuildConfig } from '../../buildRoot/buildTypes.ts';
import { alias } from './vite.config.ts';
import packageJson from './package.json';

// ESModuleでの__dirname取得
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const packageRoot = path.resolve(__dirname);

// 共通設定
const packageName = `おみくじBOT ゆっくり霊夢&魔理沙 OmikujiBot Reimu & Marisa(プレビュー版) ${packageJson.version}`;
const boothURL = 'https://pintocuru.booth.pm/items/5471598';
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
 ['ReimuMarisa_' + packageJson.version]: {
  templateJson: {
   name: packageName,
   author: packageJson.author,
   link: boothURL,
   description: packageJson.description
  },
  templateTxt: {
   packageName: packageName,
   boothURL: boothURL,
   description: '配信者のためのコメントアプリ「わんコメ」で使用できる、ジェネレーターBOT',
   readmeURL: 'https://github.com/pintocuru/OmikujiBot/blob/main/README.md'
  },
  filesToCopy: [
   { from: 'assets/config.js', to: 'config.js' },
   { from: 'assets/thumb.png', to: 'thumb.png' },
   { from: 'assets/Characters/reimu/', to: 'Characters/reimu/' },
   { from: 'assets/Characters/marisa/', to: 'Characters/marisa/' },
   { from: 'assets/OmikujiDatas/ReimuDX-250724.js', to: 'omikujiData.js' }
  ],
  packageRoot,
  entryPoints,
  alias,
  addHtmlTemplate
 }
};

// 実行
main(buildConfigs);
