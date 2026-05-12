// src/PresetManager/services/apiServiceUtils.ts
import { FileItem } from '../devTypes'

/**
 * 日付文字列をフォーマットする
 */
export const formatFileDate = (dateString: string): string => {
  try {
    const date = new Date(dateString)
    return date.toLocaleString('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch {
    return dateString
  }
}

// 日付のファイル名を返す
export const generateDateFileName = (): string => {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  const hour = String(now.getHours()).padStart(2, '0')
  const minute = String(now.getMinutes()).padStart(2, '0')
  const second = String(now.getSeconds()).padStart(2, '0')
  return `config_${year}${month}${day}_${hour}${minute}${second}`
}

// 型定義
export interface NormalizedResponse<T> {
  code: number
  data: T
}

/**
 * APIレスポンスを正規化
 */
export function normalizeApiResponse<T>(raw: any): NormalizedResponse<T> {
  if (raw && typeof raw === 'object' && 'code' in raw && 'response' in raw) {
    return { code: raw.code, data: JSON.parse(raw.response) as T }
  }

  // codeだけある場合（エラーレスポンス）
  if (raw && typeof raw === 'object' && 'code' in raw) {
    return { code: raw.code, data: null as T }
  }

  throw new Error('APIレスポンス形式が不正です')
}

/**
 * ファイル名に .json 拡張子を確実に付与
 */
export function ensureJsonExtension(fileName: string): string {
  return fileName.endsWith('.json') ? fileName : `${fileName}.json`
}

/**
 * エラーメッセージマップ
 */
const ERROR_MESSAGES: Record<string, string> = {
  list: 'ファイル一覧の取得に失敗しました',
  'save-omikuji': 'おみくじデータの保存に失敗しました',
  'save-generator': 'ジェネレーター設定の保存に失敗しました',
  save: '設定の保存に失敗しました',
  load: '設定の読み込みに失敗しました',
  'load-generator': '設定の読み込みに失敗しました',
  delete: '設定ファイルの削除に失敗しました',
}

/**
 * URLからエラーメッセージを取得
 */
export function getErrorMessage(url: string, status: number): string {
  for (const [key, message] of Object.entries(ERROR_MESSAGES)) {
    if (url.includes(key)) {
      return `${message} (${status})`
    }
  }
  return `APIリクエストに失敗しました (${status})`
}

// src/ConfigMaker/dev/services/apiServiceUtils.ts に追加
export function toFileItem(raw: { name: string; modified: string }): FileItem {
  const parts = raw.name.split('/')
  const displayName = parts[parts.length - 1].replace(/\.json$/, '')
  const folder = parts.length > 1 ? parts.slice(0, -1).join('/') : null
  return {
    name: raw.name,
    displayName,
    folder,
    modified: raw.modified,
  }
}
