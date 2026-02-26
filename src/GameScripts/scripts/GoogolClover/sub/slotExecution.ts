// src/GameScripts/scripts/GoogolClover/sub/slotExecution.ts
import { SPINS, REWARD_TABLE, FAILURE_RATE } from './constants'
import type { SlotExecutionResult, UserState } from './types'

/** スピン結果 */
interface SpinResult {
  isSuccess: boolean
  symbol: string
  multiplier: number
}

/**
 * スロット抽選の実行（純粋関数）
 */
export function executeSlotSpins(initialState: UserState): SlotExecutionResult {
  // const spins = Math.floor(Math.random() * (MAX_SPINS - MIN_SPINS + 1)) + MIN_SPINS
  const spins = SPINS
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

/**
 * スロット1回分の抽選
 * @param successCount 成功回数
 */
function spinSlot(successCount: number): SpinResult {
  const result = getRandomReward(successCount)

  if (result === null) {
    return { isSuccess: false, symbol: 'ハズレ', multiplier: 0 }
  }

  return { isSuccess: true, symbol: result.symbol, multiplier: result.multiplier }
}

/**
 * 2段階抽選システム：まずハズレ判定、次に成功役を重みベースで抽選
 */
function getRandomReward(successCount: number): { symbol: string; multiplier: number } | null {
  // 第1段階：ハズレ判定（固定確率）
  if (Math.random() < FAILURE_RATE) return null

  // 第2段階：成功役を重みベースで抽選
  // 成功回数分だけ配列の先頭から除外（progressiveな難易度上昇）
  const skipCount = Math.min(successCount, REWARD_TABLE.length - 1)
  const availableRewards = REWARD_TABLE.slice(skipCount)

  // 利用可能な役がない場合は最後の役を使用
  if (availableRewards.length === 0) {
    const lastReward = REWARD_TABLE[REWARD_TABLE.length - 1]
    const multiplier = lastReward.min + Math.random() * (lastReward.max - lastReward.min)
    return { symbol: lastReward.symbol, multiplier }
  }

  const totalWeight = availableRewards.reduce((sum, r) => sum + r.weight, 0)
  const rand = Math.random() * totalWeight

  let cumulative = 0
  for (const reward of availableRewards) {
    cumulative += reward.weight
    if (rand < cumulative) {
      const multiplier = reward.min + Math.random() * (reward.max - reward.min)
      return { symbol: reward.symbol, multiplier }
    }
  }

  // フォールバック
  const lastReward = availableRewards[availableRewards.length - 1]
  return {
    symbol: lastReward.symbol,
    multiplier: lastReward.min + Math.random() * (lastReward.max - lastReward.min),
  }
}
