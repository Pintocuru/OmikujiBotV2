// tools\buildOptions\baseSettings.ts
import path from 'path'
import { getKey } from '@/types/SettingMode'
import { generateJsContent } from '@/ConfigMaker/components/presetsExport/generateContent'
import { generateAccessLevelData } from './processJsonData'

export function createCommonBuildConfig(packageRoot: string) {
  return {
    packageRoot,

    // ライセンスキー
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
      jsonPathRoot: path.resolve(packageRoot, 'server/omikujiDatas/'),
      generateAccessLevelData,
      generateJsContent,
    },
  }
}
