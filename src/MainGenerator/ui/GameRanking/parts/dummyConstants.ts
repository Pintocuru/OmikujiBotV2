// src/MainGenerator/ui/GameRanking/parts/dummyConstants.ts
/**
 * ダミーデータ生成用の定数
 */

export const CANDIDATE_NAMES = [
  'てい',
  'ポッピィー',
  'おふとん',
  'もこもこ',
  'じゅん',
  'たかゆき',
  'すいすい',
  'たいよう',
  'ふわみ',
  'いろは',

  'なな',
  'きよし',
  'おとは',
  'こはく',
  'さくら',
  'ぽこら',
  'あくま',
  'りきいち',
  'せいじん',
  'はじめ',

  'かるび',
  'みく',
  'あおい',
  'こばや',
  'くいず',
  'さーくら',
  'しゃち',
  'とうほく',
  'ねこ',

  'ぷらす',
  'うかい',
  'りく',
  'まぐれ',
  'たかな',
  'みこ',
  'たかとら',
  'どすけべ',
  'せすぴん',
  '渋谷区大型デパートヨコセヨ',
] as const

/** YouTuber 風のサフィックス */
export const NAME_SUFFIXES = [
  'チャンネル',
  'TV',
  'Games',
  'Studio',
  'Lab',
  'Project',
  'Works',
  'Club',
  'Factory',
  'Show',
  'Tube',
  'Records',
] as const

/** サフィックスを付与する確率 */
export const SUFFIX_PROBABILITY = 0.2

/** ユーザー統計のランダム値レンジ */
export const USER_STATS_RANGES = {
  tc: { min: 1, max: 5000 },
  score: { min: 200, max: 20000 },
  giftPrice: {
    zeroProbability: 0.7,
    min: 200,
    max: 20000,
  },
} as const

/** ランキング用ポイントのレンジ */
export const RANKING_POINTS_RANGE = { min: 1000, max: 3000 } as const
