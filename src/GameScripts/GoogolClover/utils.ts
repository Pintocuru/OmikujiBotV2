// src/GameScripts/GoogolClover/utils.ts

import { FAILURE_RATE, REWARD_TABLE } from './constants'
import type { SpinResult } from './types'

/**
 * 短縮形式のe表記
 */
export function formatShort(funds: number, exp: number): string {
  return `${funds.toFixed(1)}e${exp}`
}

/**
 * ランダムな報酬を抽選
 */
export function getRandomReward(): { name: string; symbol: string; multiplier: number } | null {
  const rand = Math.random()

  // ハズレ判定
  if (rand < FAILURE_RATE) {
    return null
  }

  // 成功役の抽選
  let cumulative = FAILURE_RATE
  for (const reward of REWARD_TABLE) {
    cumulative += reward.rate
    if (rand < cumulative) {
      const multiplier = reward.min + Math.random() * (reward.max - reward.min)
      return { name: reward.name, symbol: reward.symbol, multiplier }
    }
  }

  // フォールバック
  const lastReward = REWARD_TABLE[REWARD_TABLE.length - 1]
  return {
    name: lastReward.name,
    symbol: lastReward.symbol,
    multiplier: lastReward.min + Math.random() * (lastReward.max - lastReward.min),
  }
}

/**
 * スロット1回分の抽選
 */
export function spinSlot(): SpinResult {
  const result = getRandomReward()

  if (result === null) {
    return { isSuccess: false, name: 'ハズレ', symbol: '💣', multiplier: 0 }
  }

  return { isSuccess: true, name: result.name, symbol: result.symbol, multiplier: result.multiplier }
}
