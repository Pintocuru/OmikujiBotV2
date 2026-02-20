// src/types/MetaMaps/UiKindMaps.ts

/**
 * スロット定義
 */
export const UiSlotMap = {
  primary: { label: 'メイン表示', description: 'BOTアクションの「フキダシ」モードを表示します' },
  secondary: { label: 'サブ表示', description: 'BOTアクションの「トースト」モードを表示します' },
  extra: { label: 'エクストラ', description: '主にゲームスクリプトのセリフを表示します。' },
} as const

/**
 * コンポーネント種類の定義
 */
export const uiKindMap = {
  bubble: { slot: 'primary', label: 'フキダシ' },
  toast: { slot: 'secondary', label: 'トースト' },
  ranking: { slot: 'extra', label: 'ランキング' },
  counter: { slot: 'extra', label: 'カウンター' },
  winnerGroup: { slot: 'extra', label: 'ラッキーメンバーズ' },
  flightSeat: { slot: 'extra', label: 'フライトシート' },
  flashBanner: { slot: 'primary', label: 'ニュース' },
} as const
