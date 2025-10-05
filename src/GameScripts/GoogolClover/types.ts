// src/GameScripts/GoogolClover/types.ts

/** ユーザーの状態 */
export interface UserState {
  funds: number
  exp: number
}

/** ゲーム結果 */
export interface SlotResult {
  message: string
  symbol: string
  payout: number
  party: string
}

/** 報酬テーブルの定義 */
export interface RewardEntry {
  name: string
  rate: number
  min: number
  max: number
  symbol: string
}

/** スピン結果 */
export interface SpinResult {
  isSuccess: boolean
  name: string
  symbol: string
  multiplier: number
}
