// src/GameScripts/GoogolClover/game.ts
import { GOAL_EXPONENT, MIN_SPINS, MAX_SPINS, CURRENCY_SYMBOL } from './constants'
import type { UserState, SlotResult } from './types'
import { formatShort, spinSlot } from './utils'

/**
 * スロットゲームのメイン処理
 * クラスではなく純粋関数として実装
 */
export function playSlot(userStates: Map<string, UserState>, userId: string, userName: string): SlotResult {
  // 状態の取得または初期化
  let state = userStates.get(userId) ?? { funds: 1.0, exp: 0, successCount: 0, isGoogol: false }

  // ランダムにMIN_SPINS～MAX_SPINS回の抽選を一括実行
  const spins = Math.floor(Math.random() * (MAX_SPINS - MIN_SPINS + 1)) + MIN_SPINS
  let totalMultiplier = 1.0
  let failedAt = -1
  const multipliers: number[] = []

  for (let i = 0; i < spins; i++) {
    // このプレイセッションの開始時点での成功回数を使用
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

  // 全て成功した場合のみ、成功回数を1回増やす
  if (failedAt < 0) state.successCount++

  const multipliersDisplay = multipliers.map((m) => `${m}`).join('×')

  // 失敗した場合
  if (failedAt > 0) {
    const finalDisplay = formatShort(state.funds, state.exp)
    userStates.delete(userId)

    return {
      message: `${userName}はサイコロを振る! ${multipliersDisplay}!${userName}は奈落へと消えた。`, // Result:${finalDisplay}${CURRENCY_SYMBOL}
      payout: 0,
      success: false,
    }
  }

  // 全て成功：資金を更新
  state.funds *= totalMultiplier

  // 正規化（funds を 1.0～10.0 の範囲に）
  const NORMALIZATION_THRESHOLD = 10 // 資金の正規化基準値
  const NORMALIZATION_DIVISOR = 10 // 資金の正規化除数
  while (state.funds >= NORMALIZATION_THRESHOLD) {
    state.funds /= NORMALIZATION_DIVISOR
    state.exp++
  }

  // 目標達成チェック
  if (state.exp >= GOAL_EXPONENT) {
    let exitVoice = ''
    const finalDisplay = formatShort(state.funds, state.exp)
    if (!state.isGoogol) {
      exitVoice = '出口への扉が開いた。'
      state.isGoogol = true
    }

    return {
      message: `${userName}はサイコロを振る! ${multipliersDisplay}!${finalDisplay}${CURRENCY_SYMBOL}獲得!${exitVoice}`,
      payout: Math.floor(state.funds * Math.pow(10, state.exp % 10)),
      success: true,
    }
  }

  // 状態を保存
  userStates.set(userId, state)

  // 結果表示
  const currentDisplay = formatShort(state.funds, state.exp)

  return {
    message: `${userName}はサイコロを振る! ${multipliersDisplay}!${currentDisplay}${CURRENCY_SYMBOL}獲得!`,
    payout: Math.floor(totalMultiplier - 1),
    success: true,
  }
}
