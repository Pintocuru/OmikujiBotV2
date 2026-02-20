// src/GameScripts/scripts/GoogolClover/sub/constants.ts

/** 目標桁数 */
export const GOAL_EXPONENT = 100

/** ハズレ確率（固定） */
export const FAILURE_RATE = 0.05

// サイコロを降る回数
export const SPINS = 5

/** スピン回数の最小値 */
export const MIN_SPINS = 5

/** スピン回数の最大値 */
export const MAX_SPINS = 5

/** 通貨単位 */
export const CURRENCY_SYMBOL = '☘️'

/** 小数点以下の表示桁数 */
export const DECIMAL_PLACES = 2

/** 報酬テーブルの定義 */
interface RewardEntry {
  symbol: string
  weight: number
  min: number
  max: number
}

/** 成功役テーブル（重さベース） */
export const REWARD_TABLE: RewardEntry[] = [
  { symbol: 'チェリー', weight: 30, min: 10, max: 49 },
  { symbol: 'チェリー', weight: 30, min: 50, max: 50 },
  { symbol: 'オレンジ', weight: 30, min: 20, max: 199 },
  { symbol: 'オレンジ', weight: 30, min: 200, max: 200 },
  { symbol: 'プラム', weight: 20, min: 50, max: 499 },
  { symbol: 'プラム', weight: 20, min: 500, max: 500 },
  { symbol: 'スイカ', weight: 20, min: 100, max: 999 },
  { symbol: 'スイカ', weight: 20, min: 1000, max: 1000 },
  { symbol: 'ベル', weight: 10, min: 500, max: 4999 },
  { symbol: 'ベル', weight: 10, min: 5000, max: 5000 },
  { symbol: 'バー', weight: 10, min: 1000, max: 9999 },
  { symbol: 'バー', weight: 10, min: 10000, max: 10000 },
  { symbol: 'ダイヤ', weight: 5, min: 2000, max: 19999 },
  { symbol: 'ダイヤ', weight: 5, min: 20000, max: 20000 },
  { symbol: 'セブン', weight: 5, min: 5000, max: 77777 },
  { symbol: 'セブン', weight: 5, min: 77777, max: 77777 },
]
