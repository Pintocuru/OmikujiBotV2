// server/utils/validation.ts

/**
 * ファイル名のバリデーション
 * - 英数字、ハイフン、ドット、スペース、アンダースコアのみ許可
 * - 拡張子は .json のみ
 */
export function validateFileName(fileName: string): boolean {
  if (!fileName || typeof fileName !== 'string') {
    return false
  }
  return /^[\w\-. ]+\.json$/.test(fileName)
}
