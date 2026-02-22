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
  bubble: {
    slot: 'primary',
    label: 'フキダシ',
    icon: 'MessageSquare',
    description: 'BOTの発言内容を吹き出し形式で表示します。',
  },
  flashBanner: {
    slot: 'primary',
    label: 'ニュース',
    icon: 'Megaphone',
    description: 'ニュース風のテロップを表示します。',
  },
  toast: {
    slot: 'secondary',
    label: 'トースト',
    icon: 'Bell',
    description: '一時的な通知メッセージを表示します。',
  },
  ranking: {
    slot: 'extra',
    label: 'ランキング',
    icon: 'Trophy',
    description: 'ゲームやイベントの順位一覧を表示します。',
  },
  counter: {
    slot: 'extra',
    label: 'カウンター',
    icon: 'Hash',
    description: '数値の増減やユーザーリストを表示します。',
  },
  winnerGroup: {
    slot: 'extra',
    label: 'ラッキーメンバーズ',
    icon: 'Crown',
    description: 'コメントしたユーザーをランダムに表示します。',
  },
  flightSeat: {
    slot: 'extra',
    label: 'フライトシート',
    icon: 'Plane',
    description: '座席風レイアウトでコメントしたユーザーを一覧表示します。',
  },
} as const
