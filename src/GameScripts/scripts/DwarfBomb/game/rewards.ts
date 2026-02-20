// src/GameScripts/scripts/DwarfBomb/game/rewards.ts
import { Dwarf, RewardType, GAME_CONFIG } from './gameConfigs'

// ---- 重み付き抽選 ----

function weightedSelect(weights: readonly number[]): number {
  const totalWeight = weights.reduce((a, b) => a + b, 0)
  const rand = Math.random() * totalWeight
  let sum = 0
  return weights.findIndex((w) => (sum += w) > rand)
}

function getGoldAmount(rewardKey: keyof typeof GAME_CONFIG.GOLD_REWARDS): number {
  const config = GAME_CONFIG.GOLD_REWARDS[rewardKey]
  const selectedIndex = weightedSelect(config.weights)
  return config.amounts[selectedIndex]
}

export function selectReward(): RewardType {
  const totalWeight = GAME_CONFIG.REWARD_ITEMS.reduce((sum, item) => sum + item.weight, 0)
  const rand = Math.random() * totalWeight
  let sum = 0
  const index = GAME_CONFIG.REWARD_ITEMS.findIndex((item) => (sum += item.weight) > rand)
  return index as RewardType
}

// ---- 報酬適用 ----
// 副作用: dwarf / dwarfs を直接変更する（ゲームループ内の慣習に合わせてミュータブル）
// 返り値: items に追加する絵文字文字列

export function applyReward(dwarf: Dwarf, dwarfs: Dwarf[], rewardType: RewardType): string {
  switch (rewardType) {
    case RewardType.UNKO:
      dwarf.gold += 1
      return ''

    case RewardType.MEDIUM_GOLD:
      dwarf.gold += getGoldAmount('mediumGold')
      return '🪙'

    case RewardType.LARGE_GOLD:
      dwarf.gold += getGoldAmount('largeGold')
      return '💴'

    case RewardType.GOLD_MULTIPLIER: {
      const multiplier = getGoldAmount('goldMultiplier')
      const before = dwarf.gold
      dwarf.gold = Math.max(1, dwarf.gold * multiplier)
      if (dwarf.gold > before) {
        const digits = Math.floor(Math.log10(dwarf.gold))
        return '💰'.repeat(digits * digits)
      }
      return ''
    }

    case RewardType.DIAMOND_MULTIPLIER: {
      const multiplier = getGoldAmount('diamondMultiplier')
      const before = dwarf.gold
      dwarf.gold = Math.max(1, dwarf.gold * multiplier)
      if (dwarf.gold > before) {
        const digits = Math.floor(Math.log10(dwarf.gold))
        return '💎'.repeat(digits * digits)
      }
      return ''
    }

    case RewardType.GREEN_CHEST:
      // 他の dwarf の gold を選択された dwarf に集約
      dwarfs.forEach((d) => {
        if (d !== dwarf) {
          dwarf.gold += d.gold
          d.gold = 0
        }
      })
      return '🥕'

    case RewardType.RED_CHEST:
      if (!dwarf.hasRed) {
        dwarf.hasRed = true
      } else {
        dwarf.gold += 1
      }
      return ''

    case RewardType.DYNAMITE:
      if (!dwarf.hasDynamite) {
        dwarf.hasDynamite = true
      } else {
        dwarf.gold += 1
      }
      return ''

    default:
      return ''
  }
}
