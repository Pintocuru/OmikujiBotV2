// src/GameScripts/GoogolClover/stateNormalizer.ts
import type { UserState } from './types'

/**
 * 資金の正規化（純粋関数）
 */
export function normalizeState(state: UserState): UserState {
  const NORMALIZATION_THRESHOLD = 10
  const NORMALIZATION_DIVISOR = 10
  let { funds, exp } = state

  while (funds >= NORMALIZATION_THRESHOLD) {
    funds /= NORMALIZATION_DIVISOR
    exp++
  }

  return { ...state, funds, exp }
}
