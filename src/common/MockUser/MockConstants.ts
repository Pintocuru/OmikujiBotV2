// src/common/MockUser/MockConstants.ts

/** サフィックスを付与する確率 */
export const SUFFIX_PROBABILITY = 0.2

/** ユーザー統計のランダム値レンジ */
export const USER_STATS_RANGES = {
  tc: { min: 1, max: 5000 },
  no: { min: 1, max: 50 },
  score: { min: 200, max: 20000 },
  giftPrice: {
    zeroProbability: 0.7,
    min: 200,
    max: 20000,
  },
} as const

/** ランキング用ポイントのレンジ */
export const RANKING_POINTS_RANGE = { min: 1000, max: 3000 } as const
