// src/types/MetaMaps/UiSettingsMaps.ts

/**
 * ニュースフラッシュ コンポーネントの選択肢
 */
export const flashComponentMap = {
  standard: 'シンプル',
  ticker: 'ティッカー',
  glass: 'ガラス',
  arcade: 'アーケード',
} as const

/**
 * ランキング GameRanking
 */
export const rankingSortOrderMap = {
  new: '新着順',
  high: 'スコア高い順',
  low: 'スコア低い順',
} as const

// ランキングコンポーネントの選択肢
export const rankingComponentMap = {
  rankStandard: 'カウンター+最後のユーザー',
} as const

/**
 * カウンターコンポーネントの表示名マップ
 */
export const counterComponentMap = {
  counterUser: 'カウンター+最後のユーザー',
  counterTimer: '最後のユーザーからの経過時間',
  userList: 'ユーザーリスト(バッジ)',
  UserCardScroller: 'ユーザーリスト(縦型)',
} as const

/**
 * ラッキーメンバーズコンポーネントの表示名マップ
 */
export const winnerComponentMap = {
  valentineCoupling: 'バレンタイン・カップリング',
  topStars: 'トップスターズ',
} as const

/**
 * フライトシートレイアウトの表示名マップ
 */
export const flightSeatLayoutMap = {
  square: '正方形グリッド',
  circle: 'サークル',
  custom: 'カスタム配列',
} as const

/**
 * ライバーカウンターコンポーネントの表示名マップ
 */
export const liverComponentMap = {
  basicCircle: 'シンプル丸型',
} as const

export const liverDefaultMap = {
  upVote: '高評価数',
  viewer: '視聴者数',
  syoken: '初見さん数',
  commenter: 'コメントしたユーザー数',
  lc: '配信コメント数',
  totalPrice: '合計金額',
} as const
