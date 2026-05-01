// src/GameScripts/scripts/GouseiSuika/gameConfigs.ts
import { PostFlowWordPartyType } from '@/types'

/**
 * 型定義
 */
// 各ゲーム（例: suika）がキー
export type GameConfigs = Record<string, GameConfigDetails>

export type GameConfigDetails = {
  small: GameConfigItem[] // small ゲーム設定の配列
  big: GameConfigItem[] // big ゲーム設定の配列
}

export type GameConfigItem = {
  chance: number // 確率
  times?: number // オプショナル: 繰り返し回数
  points: number // ポイント
  damage?: number // オプショナル: ダメージ
  party: string // キャラクターやアイテムの名前
}

export interface GameResult {
  points: number
  postArray: PostFlowWordPartyType[]
}

// ゲーム関連の定数
export const GAME_CONSTANTS = {
  SCORE_MULTIPLIER: { MIN: 1, MAX: 1 },
  INITIAL_LIFE: 3,
  EMOJI_DELAY: 1,
  SPECIAL_EFFECT_DELAY: 8.5,
  HALF_DIVISOR: 2,
  RANDOM_THRESHOLD: 6,
} as const

// ---

/**
 * 設定値
 */

export const GAME_CONFIGS: GameConfigs = {
  // スイカゲーム
  スイカ: {
    small: [
      { chance: 67, times: 15, points: 1, party: 'GouseiSuikaStrawberry' }, // いちご：1点
      { chance: 50, times: 15, points: 3, party: 'GouseiSuikaGrape' }, // ぶどう：3点
      { chance: 50, times: 10, points: 10, party: 'GouseiSuikaGrape' }, // デコポン：10点
      { chance: 50, times: 8, points: 20, party: 'GouseiSuikaPresimmon' }, // かき：20点
      { chance: 67, times: 5, points: 50, party: 'GouseiSuikaApple' }, // りんご：50点
    ],
    big: [
      { chance: 25, points: 300, damage: 1, party: 'GouseiSuikaPear' }, // なし
      { chance: 25, points: 400, damage: 1, party: 'GouseiSuikaPineapple' }, // パイナップル
      { chance: 33, points: 500, damage: 2, party: 'GouseiSuikaPeach' }, // もも
      { chance: 33, points: 700, damage: 2, party: 'GouseiSuikaMelon' }, // メロン
      { chance: 50, points: 1000, damage: 3, party: 'GouseiSuikaWatermelon' }, // スイカ
      { chance: 100, points: 1000, damage: -3, party: 'GouseiSuikaWatermelon' }, // ダブル
    ],
  },

  // カボチャゲーム
  カボチャ: {
    small: [
      { chance: 67, times: 15, points: 1, party: 'GouseiSuikaStrawberry' }, // いちご strawberry
      { chance: 50, times: 15, points: 3, party: 'GouseiSuikaGrape' }, // ぶどう grape
      { chance: 50, times: 10, points: 10, party: 'GouseiSuikaDekopon' }, // デコポン dekopon
      { chance: 50, times: 8, points: 20, party: 'GouseiSuikaPresimmon' }, // かき persimmon
      { chance: 67, times: 5, points: 50, party: 'GouseiSuikaApple' }, // りんご apple
    ],
    big: [
      { chance: 33, points: 200, damage: 0, party: 'GouseiSuikaCandy' }, // キャンディー candy
      { chance: 33, points: 300, damage: 1, party: 'GouseiSuikaPear' }, // なし pear
      { chance: 33, points: 400, damage: 1, party: 'GouseiSuikaPineapple' }, // パイナップル pineapple
      { chance: 33, points: 500, damage: 2, party: 'GouseiSuikaPeach' }, // もも peach
      { chance: 33, points: 700, damage: 2, party: 'GouseiSuikaMelon' }, // メロン melon
      { chance: 50, points: 1000, damage: 3, party: 'GouseiSuikaWatermelon' }, // スイカ watermelon
      { chance: 100, points: 1000, damage: -3, party: 'GouseiSuikaPumpkin' }, // カボチャ pumpkin
    ],
  },

  // クジラゲーム
  クジラ: {
    small: [
      { chance: 50, times: 5, points: 11, party: 'GouseiSuikaClownfish' },
      { chance: 50, times: 5, points: 22, party: 'GouseiSuikaJellyfish' },
      { chance: 50, times: 5, points: 33, party: 'GouseiSuikaPufferfish' },
      { chance: 50, times: 5, points: 44, party: 'GouseiSuikaCrab' },
      { chance: 50, times: 5, points: 55, party: 'GouseiSuikaTuna' },
    ],
    big: [
      { chance: 20, points: 0, damage: 3, party: 'GouseiSuikaOrca' },
      { chance: 25, points: 200, damage: 0, party: 'GouseiSuikaTurtle' },
      { chance: 25, points: 250, damage: 0, party: 'GouseiSuikaSunfish' },
      { chance: 25, points: 300, damage: 0, party: 'GouseiSuikaShark' },
      { chance: 100, points: 500, damage: 0, party: 'GouseiSuikaWhale' },
    ],
  },
}
