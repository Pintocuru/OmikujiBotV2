// tools/buildOptions/baseSettings.ts
import path from 'path'
import { getKey } from '@/common/FeatureAccess/SettingMode'
import { generateJsContent } from '@config/components/presetsExport/generateContent'
import { generateAccessLevelData } from './processJsonData'
import { processMerge } from '../JsonMerge/JsonMergeProcessor'
import { APP_VERSION, BUILD_DATE } from '@/version'

/**
 * 共通のビルド設定を生成
 * @param packageRoot パッケージのルートディレクトリ
 */
export function createCommonBuildConfig(packageRoot: string) {
  return {
    version: `${BUILD_DATE}-${APP_VERSION}`,
    packageRoot,
    entryPoints: null,

    // ライセンスキー
    licenseKey: {
      none: '',
      basic: '',
      adv: getKey('adv'),
      pro: getKey('pro'),
      godMode: getKey('godMode'),
    },

    // HTML設定
    addHtmlTemplate: `
      <!-- おみくじデータ -->
      <script src="./omikujiData.js" defer></script>
    `,

    // JSON設定（おみくじデータ）
    json: {
      jsonPathRoot: path.resolve(packageRoot, 'server/presets/'),
      generateAccessLevelData,
      generateJsContent,
      assembleJsonData: processMerge,
    },
  }
}

/**
 * JSON設定（おみくじデータ）
 */
export function createCommonBuildConfigRoot(packageRoot: string, jsonPath: string) {
  return {
    jsonPathRoot: path.resolve(packageRoot, 'server/presets/'),
    jsonPath,
    generateAccessLevelData,
    generateJsContent,
    assembleJsonData: processMerge,
  }
}
