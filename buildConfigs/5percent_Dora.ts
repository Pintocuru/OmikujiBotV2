// buildConfigs/5percent_Dora.ts
import path from 'path';
import { fileURLToPath } from 'url';
import { BuildConfig } from '../../../buildRoot/buildTypes.ts';
import { generateJsContent } from '../src/configMaker/components/presets/generateContent.ts';

// このファイル専用の設定
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const packageRoot = path.resolve(__dirname, '../');

const buildConfig: BuildConfig = {
 configKey: 'ReimuMarisa_0.8.0-beta06',
 packageRoot,
 entryPoints: {
  MainGenerator: path.resolve(packageRoot, 'src/MainGenerator/main.ts'),
  ConfigMaker: path.resolve(packageRoot, 'src/ConfigMaker/main.ts')
 },
 isOneSDK: false,
 filesToCopy: [
  { from: 'assets/config.js', to: 'config.js' },
  { from: 'assets/thumb/ReimuMarisaDX.png', to: 'thumb.png' },
  { from: 'assets/Characters/reimu/', to: 'Characters/reimu/' },
  { from: 'assets/Characters/marisa/', to: 'Characters/marisa/' }
 ],
 addHtmlTemplate: `
    <!-- 設定ファイル -->
    <script src="./config.js" defer></script>
    <!-- おみくじデータ -->
    <script src="./omikujiData.js" defer></script>
  `,
 template: {
  name: 'おみくじBOT ゆっくり霊夢&魔理沙 OmikujiBot Reimu & Marisa(プレビュー版) 0.8.0-beta06',
  boothURL: 'https://pintocuru.booth.pm/items/5471598',
  readmeURL: 'https://github.com/pintocuru/OmikujiBot/blob/main/README.md',
  description: '配信者のためのコメントアプリ「わんコメ」で使用できる、ジェネレーターBOT'
 },
 json: {
  jsonPath: 'ReimuDX-250724.json',
  generateJsContent: generateJsContent
 }
};

export default buildConfig;
