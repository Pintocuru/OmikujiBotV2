// src/types/MetaMaps/UiKindMaps.ts

/**
 * スロット定義
 */
export const UiSlotMap = {
  primary: {
    label: 'BOTコメント(メイン)',
    description: 'わんコメでのコメント表示や読み上げの対象となります',
  },
  secondary: {
    label: 'BOTコメント(サブ)',
    description: 'わんコメでのコメント表示や読み上げの対象にはなりません。',
  },
  extra: {
    label: 'エクストラ',
    description: 'ゲームや演出の用途で使用されるアイテムです。',
  },
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
