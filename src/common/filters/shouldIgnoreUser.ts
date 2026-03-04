// src/common/filters/shouldIgnoreUser.ts

/**
 * ユーザー記録を除外するかどうかを判定する
 * @param userName omiken.userName
 * @param pattern Settings.ignoreUserPattern（正規表現文字列）
 */
export const shouldIgnoreUser = (userName: string, pattern: string): boolean => {
  if (!pattern || !userName) return false

  try {
    const regex = new RegExp(pattern, 'i')
    return regex.test(userName)
  } catch (e) {
    console.warn('ignoreUserPattern の正規表現が不正です:', e)
    return false
  }
}
