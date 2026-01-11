// tools\buildOptions\baseSettings.ts
import path from 'path'
import { getKey } from '@/common/FeatureAccess/SettingMode'
import { generateJsContent } from '@config/components/presetsExport/generateContent'
import { generateAccessLevelData } from './processJsonData'
import { processMerge } from '../JsonMerge/JsonMergeProcessor'

export function createCommonBuildConfig(packageRoot: string, isConfigGenerator: boolean = true) {
  // ビルド設定
  const entryPoints: Record<string, string> = {
    MainGenerator: path.resolve(packageRoot, 'src/MainGenerator/main.ts'),
  }
  if (isConfigGenerator) {
    entryPoints.ConfigMaker = path.resolve(packageRoot, 'src/ConfigMaker/main.ts')
  }

  return {
    packageRoot,
    entryPoints,

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
