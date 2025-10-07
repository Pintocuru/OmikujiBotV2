// src/GameScripts/GoogolClover/types.ts

/** ユーザーの状態 */
export interface UserState {
  funds: number
  exp: number
  successCount: number
}

/** ゲーム結果 */
export interface SlotResult {
  message: string
  payout: number
  party: string
}

/** 報酬テーブルの定義 */
export interface RewardEntry {
  name: string
  weight: number
  min: number
  max: number
}

/** スピン結果 */
export interface SpinResult {
  isSuccess: boolean
  name: string
  multiplier: number
}
