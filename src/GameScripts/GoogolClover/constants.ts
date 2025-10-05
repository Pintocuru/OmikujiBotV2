// src/GameScripts/GoogolClover/constants.ts
import type { RewardEntry } from './types'

/** 目標桁数 */
export const GOAL_EXPONENT = 100

/** ハズレ確率 */
export const FAILURE_RATE = 0.02

/** 成功役テーブル */
export const REWARD_TABLE: RewardEntry[] = [
  { name: 'チェリー', rate: 0.25, min: 10, max: 11, symbol: '🍒' },
  { name: 'オレンジ', rate: 0.2, min: 14, max: 16, symbol: '🍊' },
  { name: 'プラム', rate: 0.15, min: 20, max: 30, symbol: '🍑' },
  { name: 'スイカ', rate: 0.1, min: 30, max: 50, symbol: '🍉' },
  { name: 'ベル', rate: 0.09, min: 50, max: 100, symbol: '🔔' },
  { name: 'バー', rate: 0.08, min: 100, max: 200, symbol: '💎' },
  { name: 'ダイヤ', rate: 0.06, min: 200, max: 500, symbol: '💠' },
  { name: 'セブン', rate: 0.05, min: 500, max: 1000, symbol: '7️⃣' },
]
