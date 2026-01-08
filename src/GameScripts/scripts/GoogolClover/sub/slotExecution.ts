// src/GameScripts/GoogolClover/slotExecution.ts
import { MIN_SPINS, MAX_SPINS } from './constants'
import type { UserState } from './types'
import { spinSlot } from './utils'

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

/**
 * スロット抽選の実行（純粋関数）
 */
export function executeSlotSpins(initialState: UserState): SlotExecutionResult {
  const spins = Math.floor(Math.random() * (MAX_SPINS - MIN_SPINS + 1)) + MIN_SPINS
  let totalMultiplier = 1.0
  let failedAt = -1
  const multipliers: number[] = []
  let state = { ...initialState }

  for (let i = 0; i < spins; i++) {
    const result = spinSlot(state.successCount)

    if (!result.isSuccess) {
      failedAt = i + 1
      multipliers.push(0)
      break
    }

    const currentMultiplier = 1 + result.multiplier
    totalMultiplier *= currentMultiplier
    multipliers.push(Math.round(result.multiplier))
  }

  // 全て成功した場合のみ成功回数を増やす
  if (failedAt < 0) {
    state = { ...state, successCount: state.successCount + 1 }
  }

  return { spins, totalMultiplier, failedAt, multipliers, state }
}
