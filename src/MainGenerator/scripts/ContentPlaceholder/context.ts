// src/MainGenerator/scripts/ContentPlaceholder/context.ts
import { KeyValueMap } from '@main/scripts/KeyValue/KeyValueMap'

/**
 * プレースホルダーのコンテキスト値を管理
 * ユーザー名、日付など、動的に設定される値を保持
 */
export class PlaceholderContext extends KeyValueMap {
  /**
   * コンテキスト値を更新
   */
  updateValues(values: Record<string, string | number>): void {
    Object.entries(values).forEach(([key, value]) => {
      this.set(key, value)
    })
  }
}

/**
 * テキスト無害化
 * - URL (http:// または https://) を含む場合は全文削除
 * - 予約語 <<userImage>> <<winnerImage>> は許可
 */
export function sanitizeText(text: string): string {
  if (!text) return ''

  // 予約語は安全なのでスキップ
  const allowedPlaceholders = ['<<userImage>>', '<<winnerImage>>']

  // 予約語を一時的に退避
  let safeText = text
  const placeholderMap = new Map<string, string>()

  allowedPlaceholders.forEach((ph, i) => {
    const token = `__PH_${i}__`
    if (safeText.includes(ph)) {
      placeholderMap.set(token, ph)
      safeText = safeText.replaceAll(ph, token)
    }
  })

  // URL を含む場合は全文削除
  if (/https?:\/\/\S+/i.test(safeText)) {
    return ''
  }

  // 予約語を戻す
  placeholderMap.forEach((ph, token) => {
    safeText = safeText.replaceAll(token, ph)
  })

  return safeText
}
