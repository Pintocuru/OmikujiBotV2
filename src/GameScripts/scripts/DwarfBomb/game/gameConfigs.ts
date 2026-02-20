// src/GameScripts/scripts/DwarfBomb/game/gameConfigs.ts

export interface GameResult {
  day: number
  payout: number
  message: string
  dwarfs: Dwarf[]
  items: string
  specialEffectCount: number
}

export interface Dwarf {
  gold: number
  redChest: number
  hasRed: boolean
  hasDynamite: boolean
}

// 報酬アイテムの定義
export interface RewardItem {
  name: string
  weight: number
  emoji?: string
  description: string
}

// 報酬タイプの列挙
export enum RewardType {
  UNKO = 0,
  MEDIUM_GOLD = 1,
  LARGE_GOLD = 2,
  GOLD_MULTIPLIER = 3,
  DIAMOND_MULTIPLIER = 4,
  GREEN_CHEST = 5,
  RED_CHEST = 6,
  DYNAMITE = 7,
}

// 金額設定の定義
export interface GoldRewardConfig {
  amounts: number[]
  weights: number[]
}

// ---

// 設定値
export const GAME_CONFIG = {
  MAX_WIN: 5000,
  INITIAL_LIFE: 11,
  GREEN_RECOVERY: 12,
  DWARF_COUNT: 3,
  WIN_THRESHOLDS: [
    [5000, '👑JACKPOT👑 上限の'],
    [2000, '♕FEVER♕'],
    [1000, '🎯大当り🎯'],
    [500, '✌あたり✌'],
  ] as const,

  // 報酬アイテムの定義（重み付き確率）
  REWARD_ITEMS: [
    { name: 'UNKO', weight: 7, description: 'うんこ（1枚）' },
    { name: 'mediumGold', weight: 3, description: '金塊（10-25枚）' },
    { name: 'largeGold', weight: 2, description: '大きな金塊（50-100枚）' },
    { name: 'goldMultiplier', weight: 2, emoji: '💰', description: '金塊倍増（2-5倍）' },
    { name: 'diamondMultiplier', weight: 1, emoji: '💎', description: '金塊倍増（10-25倍）' },
    { name: 'greenChest', weight: 2, emoji: '🥕', description: '緑宝箱（他のうさぎの金を統合）' },
    { name: 'redChest', weight: 1, description: '赤宝箱（毎ターン金を貯蓄）' },
    { name: 'dynamite', weight: 1, description: 'TNT（他のうさぎの金を毎ターン吸収）' },
  ] as RewardItem[],

  // 金額報酬の設定
  GOLD_REWARDS: {
    mediumGold: {
      amounts: [10, 15, 25],
      weights: [4, 3, 2],
    },
    largeGold: {
      amounts: [50, 100],
      weights: [2, 1],
    },
    goldMultiplier: {
      amounts: [2, 3, 4, 5],
      weights: [5, 4, 3, 2],
    },
    diamondMultiplier: {
      amounts: [10, 25],
      weights: [5, 2],
    },
  } as Record<string, GoldRewardConfig>,
} as const
