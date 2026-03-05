// tools/buildOptions/baseSettings.ts
import fs from 'fs'
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
export function createCommonBuildConfigJson(packageRoot: string, templateName: string) {
  const presetsRoot = path.resolve(packageRoot, 'server/presets/')
  const jsonPath = findJsonPath(presetsRoot, templateName)

  return {
    jsonPathRoot: presetsRoot,
    jsonPath,
    generateAccessLevelData,
    generateJsContent,
    assembleJsonData: processMerge,
  }
}

/**
 * presets/<templateName>.json を自動探索
 */
export function findJsonPath(presetsRoot: string, templateName: string): string {
  const fullPath = findJsonPathRecursive(presetsRoot, templateName)
  if (!fullPath) {
    throw new Error(`JSON not found for template: ${templateName}`)
  }

  // presetsRoot からの相対パスに変換
  return path.relative(presetsRoot, fullPath).replace(/\\/g, '/')
}

/**
 * presets 以下を再帰的に探索し、<templateName>.json を探す
 */
function findJsonPathRecursive(root: string, targetFileName: string): string | null {
  const entries = fs.readdirSync(root, { withFileTypes: true })

  for (const entry of entries) {
    const fullPath = path.join(root, entry.name)

    if (entry.isDirectory()) {
      const result = findJsonPathRecursive(fullPath, targetFileName)
      if (result) return result
    } else if (entry.isFile() && entry.name === targetFileName) {
      return fullPath
    }
  }

  return null
}
