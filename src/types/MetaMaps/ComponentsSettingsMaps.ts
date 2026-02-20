// src/types/MetaMaps/ComponentsSettingsMaps.ts

/**
 * ランキング ソート順の表示名マップ
 */
export const rankingSortOrderLabels = {
  new: '新着順',
  high: 'スコア高い順',
  low: 'スコア低い順',
} as const

/**
 * ランキングコンポーネントの選択肢
 */
export const rankingComponents = [
  { value: 'rankStandard', label: 'カウンター+最後のユーザー' },
] as const

/**
 * カウンターコンポーネントの表示名マップ
 */
export const counterComponents = {
  counterUser: 'カウンター+最後のユーザー',
  counterTimer: '最後のユーザーからの経過時間',
  userList: 'ユーザーリスト(バッジ)',
  UserCardScroller: 'ユーザーリスト(縦型)',
} as const

/**
 * ラッキーメンバーズコンポーネントの表示名マップ
 */
export const winnerComponents = {
  valentineCoupling: 'バレンタイン・カップリング',
  topStars: 'トップスターズ',
} as const

/**
 * フライトシートレイアウトの表示名マップ
 */
export const flightSeatLayouts = {
  square: '正方形グリッド',
  circle: 'サークル',
  custom: 'カスタム配列',
} as const
