// src/GameScripts/scripts/GoogolClover/sub/utils.ts
import { DECIMAL_PLACES } from './constants'

/**
 * 短縮形式のe表記
 */
export function formatShort(funds: number, exp: number): string {
  if (exp <= 6) {
    return funds.toFixed(0).replace(/\.00$/, '')
  }
  return `${funds.toFixed(DECIMAL_PLACES)}の${exp}乗`
}

/**
 * スコア表示用のフォーマット（11桁以上で指数表記）
 */
export function formatScoreText(funds: number, exp: number): string {
  const fullNumber = funds * Math.pow(10, exp)

  // 11桁未満（10^10未満）の場合は通常表示
  if (exp < 10) {
    return String(Math.floor(fullNumber))
  }

  // 11桁以上の場合は指数表記（仮数部10桁）
  // 例: 1.234567890e+11
  const mantissa = funds.toFixed(9) // 小数点以下9桁で10桁表示
  return `${mantissa}e+${exp}`
}

/**
 * スコア値の計算（exp * 10 + funds）
 * 例: 1.23の56乗 → 561.23
 */
export function calculateScoreValue(funds: number, exp: number): number {
  return exp * 10 + funds
}
