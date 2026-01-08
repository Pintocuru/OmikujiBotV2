// src/GameScripts/GoogolClover/utils.ts
import { FAILURE_RATE, REWARD_TABLE, DECIMAL_PLACES } from './constants'
import type { SpinResult } from './types'

/**
 * 短縮形式のe表記
 */
export function formatShort(funds: number, exp: number): string {
  if (exp <= 6) {
    return funds.toFixed(0).replace(/\.00$/, '')
  }
  return `${funds.toFixed(DECIMAL_PLACES)}の${exp}乗`
}

/**
 * スコア表示用のフォーマット（11桁以上で指数表記）
 * @param funds 仮数部（1.0～10.0）
 * @param exp 指数部
 * @returns フォーマットされた文字列
 */
export function formatScoreText(funds: number, exp: number): string {
  const fullNumber = funds * Math.pow(10, exp)

  // 11桁未満（10^10未満）の場合は通常表示
  if (exp < 10) {
    return String(Math.floor(fullNumber))
  }

  // 11桁以上の場合は指数表記（仮数部10桁）
  // 例: 1.234567890e+11
  const mantissa = funds.toFixed(9) // 小数点以下9桁で10桁表示
  return `${mantissa}e+${exp}`
}

/**
 * スコア値の計算（exp * 10 + funds）
 * 例: 1.23の56乗 → 561.23
 * @param funds 仮数部（1.0～10.0）
 * @param exp 指数部
 * @returns スコア値
 */
export function calculateScoreValue(funds: number, exp: number): number {
  return exp * 10 + funds
}

/**
 * 2段階抽選システム：まずハズレ判定、次に成功役を重みベースで抽選
 * @param successCount 成功回数に応じて低配当役を除外
 */
export function getRandomReward(successCount: number): { name: string; multiplier: number } | null {
  // 第1段階：ハズレ判定（固定確率）
  if (Math.random() < FAILURE_RATE) {
    return null
  }

  // 第2段階：成功役を重みベースで抽選
  // 成功回数分だけ配列の先頭から除外（progressiveな難易度上昇）
  const skipCount = Math.min(successCount, REWARD_TABLE.length - 1)
  const availableRewards = REWARD_TABLE.slice(skipCount)

  // 利用可能な役がない場合は最後の役を使用
  if (availableRewards.length === 0) {
    const lastReward = REWARD_TABLE[REWARD_TABLE.length - 1]
    const multiplier = lastReward.min + Math.random() * (lastReward.max - lastReward.min)
    return { name: lastReward.name, multiplier }
  }

  const totalWeight = availableRewards.reduce((sum, r) => sum + r.weight, 0)
  const rand = Math.random() * totalWeight

  let cumulative = 0
  for (const reward of availableRewards) {
    cumulative += reward.weight
    if (rand < cumulative) {
      const multiplier = reward.min + Math.random() * (reward.max - reward.min)
      return { name: reward.name, multiplier }
    }
  }

  // フォールバック
  const lastReward = availableRewards[availableRewards.length - 1]
  return {
    name: lastReward.name,
    multiplier: lastReward.min + Math.random() * (lastReward.max - lastReward.min),
  }
}

/**
 * スロット1回分の抽選
 * @param successCount 成功回数
 */
export function spinSlot(successCount: number): SpinResult {
  const result = getRandomReward(successCount)

  if (result === null) {
    return { isSuccess: false, name: 'ハズレ', multiplier: 0 }
  }

  return { isSuccess: true, name: result.name, multiplier: result.multiplier }
}
