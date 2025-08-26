// buildConfigs\base\baseSettings.ts
// buildConfigs の共通項目
import path from 'path'
import { fileURLToPath } from 'url'
import { getKey } from '@/types/SettingMode'
import { generateJsContent } from '@/ConfigMaker/components/presetsExport/generateContent'
import { generateAccessLevelData } from '../../tools/processJsonData'

// このファイル専用の設定
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const packageRoot = path.resolve(__dirname, '../../')

export const commonBuildConfig = {
  packageRoot,

  licenseKey: {
    basic: '',
    pro: getKey('pro'),
    internal: getKey('godMode'),
    experimental: getKey('godMode'),
  },

  // ビルド設定
  entryPoints: {
    MainGenerator: path.resolve(packageRoot, 'src/MainGenerator/main.ts'),
    ConfigMaker: path.resolve(packageRoot, 'src/ConfigMaker/main.ts'),
  },

  // HTML設定
  addHtmlTemplate: `
    <!-- 設定ファイル -->
    <script src="./config.js" defer></script>
    <!-- おみくじデータ -->
    <script src="./omikujiData.js" defer></script>
  `,

  // JSON設定（おみくじデータ）
  json: {
    generateAccessLevelData: generateAccessLevelData,
    generateJsContent: generateJsContent,
  },
}
