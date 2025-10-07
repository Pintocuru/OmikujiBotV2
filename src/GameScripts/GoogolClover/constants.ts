// src/GameScripts/GoogolClover/constants.ts
import type { RewardEntry } from './types'

/** 目標桁数 */
export const GOAL_EXPONENT = 100

/** ハズレ確率（固定） */
export const FAILURE_RATE = 0.05

/** スピン回数の最小値 */
export const MIN_SPINS = 5

/** スピン回数の最大値 */
export const MAX_SPINS = 5

/** 資金の正規化基準値 */
export const NORMALIZATION_THRESHOLD = 10

/** 資金の正規化除数 */
export const NORMALIZATION_DIVISOR = 10

/** 通貨単位 */
export const CURRENCY_SYMBOL = '☘️'

/** 小数点以下の表示桁数 */
export const DECIMAL_PLACES = 5

/** 成功役テーブル（重さベース） */
export const REWARD_TABLE: RewardEntry[] = [
  { name: 'チェリー', weight: 30, min: 10, max: 49 },
  { name: 'チェリー', weight: 30, min: 50, max: 50 },
  { name: 'オレンジ', weight: 30, min: 20, max: 199 },
  { name: 'オレンジ', weight: 30, min: 200, max: 200 },
  { name: 'プラム', weight: 20, min: 50, max: 499 },
  { name: 'プラム', weight: 20, min: 500, max: 500 },
  { name: 'スイカ', weight: 20, min: 100, max: 999 },
  { name: 'スイカ', weight: 20, min: 1000, max: 1000 },
  { name: 'ベル', weight: 10, min: 500, max: 4999 },
  { name: 'ベル', weight: 10, min: 5000, max: 5000 },
  { name: 'バー', weight: 10, min: 1000, max: 9999 },
  { name: 'バー', weight: 10, min: 10000, max: 10000 },
  { name: 'ダイヤ', weight: 5, min: 2000, max: 19999 },
  { name: 'ダイヤ', weight: 5, min: 20000, max: 20000 },
  { name: 'セブン', weight: 5, min: 5000, max: 77777 },
  { name: 'セブン', weight: 5, min: 77777, max: 77777 },
]
