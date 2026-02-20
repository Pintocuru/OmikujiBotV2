// src/GameScripts/scripts/GoogolClover/sub/types.ts

/**
 * スロット実行結果
 */
export interface SlotExecutionResult {
  spins: number
  totalMultiplier: number
  failedAt: number
  multipliers: number[]
  state: UserState
}

/** ユーザーの状態 */
export interface UserState {
  funds: number
  exp: number
  successCount: number
  isGoogol: boolean
}
