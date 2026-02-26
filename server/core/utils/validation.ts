// server/core/utils/validation.ts

/**
 * ファイル名のバリデーション（フォルダネスト対応）
 */
export function validateFileName(fileName: string): boolean {
  if (!fileName || typeof fileName !== 'string') {
    return false
  }
  // .. によるパストラバーサル禁止
  if (fileName.includes('..')) {
    return false
  }
  // 各セグメントを検証
  const segments = fileName.split('/')
  const lastSegment = segments[segments.length - 1]

  // 最後のセグメントは .json で終わる必要がある
  if (!/^[\w\-. ]+\.json$/.test(lastSegment)) {
    return false
  }

  // 中間のフォルダ名を検証（空セグメント禁止）
  for (let i = 0; i < segments.length - 1; i++) {
    if (!/^[\w\-. ]+$/.test(segments[i])) {
      return false
    }
  }

  return true
}
