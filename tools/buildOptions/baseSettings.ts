// tools/buildOptions/baseSettings.ts
import fs from 'fs'
import path from 'path'
import { getKey } from '@/common/FeatureAccess/SettingMode'
import { generateJsContent } from '@config/components/presetsExport/generateContent'
import { generateAccessLevelData } from './processJsonData'
import { processMerge } from '../JsonMerge/JsonMergeProcessor'
import { APP_VERSION, BUILD_DATE } from '@/version'
import { ProjectConfig, ProjectParams } from '@shared/utils/webpackBuild/BuildTypes'

// ----- 定数 -----

/** index.html / ConfigMaker のセットは全プロジェクト共通 */
export const DEFAULT_FILES_TO_COPY = [
  { from: 'assets/TemplateEntry/index.html', to: 'index.html' },
  { from: 'assets/TemplateEntry/ConfigMaker.html', to: 'ConfigMaker.html' },
  { from: 'assets/TemplateEntry/script.js', to: 'script.js' },
]

/** OneSDK と おみくじデータ の外部スクリプト読み込みタグ */
const HTML_SCRIPT_TAGS = `
  <!-- OneSDK (外部読み込み) -->
  <script src="http://localhost:11180/templates/preset/__origin/js/onesdk.js" defer></script>

  <!-- おみくじデータ -->
  <script src="./omikujiData.js" defer></script>
`

// ----- ファクトリ -----

/** コアプロジェクト向けの共通ベース設定 */
export function createCoreBuildConfig(packageRoot: string) {
  return {
    version: `${BUILD_DATE}-${APP_VERSION}`,
    packageRoot,
    entryPoints: null,
    addHtmlTemplate: HTML_SCRIPT_TAGS,
    licenseKey: {
      none: '',
      basic: '',
      adv: getKey('adv'),
      pro: getKey('pro'),
      godMode: getKey('godMode'),
    },
  }
}

/**
 * プロジェクト設定を生成する。
 *
 * @param packageRoot パッケージのルートディレクトリ
 * @param color       カラーバリアント識別子（空文字の場合はデフォルト扱い）
 * @param params      プロジェクト固有パラメータ
 */
export function createProject(packageRoot: string, color: string, params: ProjectParams): ProjectConfig {
  const id = `${params.key}${color}`
  const colorLabel = color ? `${color} ` : ''
  const series = params.series ? params.series : params.key

  return {
    // --- 共通フィールド ---
    version: `${BUILD_DATE}-${APP_VERSION}`,
    packageRoot,
    entryPoints: null,

    licenseKey: {
      none: '',
      basic: '',
      adv: getKey('adv'),
      pro: getKey('pro'),
      godMode: getKey('godMode'),
    },

    addHtmlTemplate: HTML_SCRIPT_TAGS,

    // --- プロジェクト固有フィールド ---
    key: id,
    name: params.title,
    tags: params.tags,
    banner: `https://raw.githubusercontent.com/Pintocuru/OmikujiBot-Docs/refs/heads/main/${params.category}/${series}/${id}.webp`,
    licenseLabel: params.licenseLabel,

    template: {
      name: `おみくじBOT ${params.title} ${colorLabel}OmikujiBot ${id}`,
      label: `${params.title} ${colorLabel} ${id}`,
      boothURL: `https://pintocuru.booth.pm/items/${params.boothId}`,
      readmeURL: `https://github.com/Pintocuru/OmikujiBot-Docs/tree/main/${params.category}/${series}/README.ja.md`,
      description: params.description,
    },

    json: buildJsonConfig(packageRoot, `${id}.json`),

    filesToCopy: [
      ...(params.extraFiles ?? []),
      ...DEFAULT_FILES_TO_COPY,
      { from: `assets/thumb/${params.category}/${id}.gif`, to: 'thumb.gif' },
    ],
  }
}

// ----- 内部ヘルパー -----

/** JSON設定オブジェクトを生成する */
function buildJsonConfig(packageRoot: string, templateName: string) {
  const jsonPathRoot = path.resolve(packageRoot, 'server/presets/')

  return {
    jsonPathRoot,
    jsonPath: findJsonPath(jsonPathRoot, templateName),
    generateAccessLevelData,
    generateJsContent,
    assembleJsonData: processMerge,
  }
}

/**
 * presets/<templateName>.json を自動探索
 */
export function findJsonPath(presetsRoot: string, templateName: string): string {
  // 1. まず「相対パスとして」そのまま試す
  const directPath = path.join(presetsRoot, templateName)
  if (fs.existsSync(directPath)) {
    return path.relative(presetsRoot, directPath).replace(/\\/g, '/')
  }

  // 2. ダメなら「ファイル名だけ」に落として再帰探索
  const fileName = path.basename(templateName)
  const fullPath = findJsonPathRecursive(presetsRoot, fileName)
  if (!fullPath) {
    throw new Error(`JSON not found for template: ${templateName}`)
  }

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
