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
 *
 * primarySlot : そのkindが「本来属する」スロット（バリデーションのデフォルト・条件保存時に使用）
 * slots       : そのkindが「表示・選択できる」スロットの一覧
 *               primarySlot を必ず含む。複数スロットに表示したい場合は追加する。
 *               ただし primary のものを secondary で使うことはできない（逆方向のみ許可）。
 * requiresComment : true のとき、isComment が false なら選択不可にする
 */

export const uiKindMap = {
  bubble: {
    primarySlot: 'primary',
    slots: ['primary'],
    label: 'フキダシ',
    icon: 'MessageSquare',
    description: 'BOTの発言内容を吹き出し形式で表示します。',
  },
  flashBanner: {
    primarySlot: 'primary',
    slots: ['primary'],
    label: 'ニュース',
    icon: 'Megaphone',
    description: 'ニュース風のテロップを表示します。',
  },
  commentSpin: {
    primarySlot: 'primary',
    slots: ['primary', 'secondary'],
    label: 'コメントスピン',
    icon: 'Shuffle',
    description: 'コメントをランダムに選んでルーレット風に表示します。',
  },
  liveClock: {
    primarySlot: 'primary',
    slots: ['primary'],
    label: 'クロック',
    icon: 'Clock',
    description: 'メッセージを表示する時計です。',
  },
  kujibikiPanel: {
    primarySlot: 'primary',
    slots: ['primary', 'secondary'],
    label: 'くじ引き',
    icon: 'Bomb',
    description: 'test',
  },
  toast: {
    primarySlot: 'secondary',
    slots: ['primary', 'secondary'], // primary でも選択可能
    label: 'トースト',
    icon: 'Bell',
    description: '一時的な通知メッセージを表示します。',
  },
  ranking: {
    primarySlot: 'extra',
    slots: ['extra'],
    label: 'ランキング',
    icon: 'Trophy',
    description: 'ゲームやイベントの順位一覧を表示します。',
  },
  counter: {
    primarySlot: 'extra',
    slots: ['extra'],
    requiresComment: true, // コメント機能が有効なときのみ使用可
    label: 'カウンター',
    icon: 'Hash',
    description: '数値の増減やユーザーリストを表示します。',
  },
  streamCounter: {
    primarySlot: 'extra',
    slots: ['extra'],
    icon: 'Hash',
    label: 'ライバーカウンター',
    description: '高評価・同接数等、複数のさまざまなカウンターを表示します',
  },
  cookieCounter: {
    primarySlot: 'extra',
    slots: ['extra'],
    icon: 'Cookie',
    label: 'クッキーカウンター',
    description: '高評価・同接数等、単一またはセットのカウンターを表示します',
  },
  winnerGroup: {
    primarySlot: 'extra',
    slots: ['extra'],
    label: 'ラッキーメンバーズ',
    icon: 'Crown',
    description: 'コメントしたユーザーをランダムに表示します。',
  },
  flightSeat: {
    primarySlot: 'extra',
    slots: ['extra'],
    label: 'フライトシート',
    icon: 'Plane',
    description: '座席風レイアウトでコメントしたユーザーを一覧表示します。',
  },
  socialRoster: {
    primarySlot: 'extra',
    slots: ['extra'],
    label: 'ソーシャルユーザーリスト',
    icon: 'Users',
    description: 'コメントしたユーザーをソーシャルゲーム風のグリッドで一覧表示します',
  },
  deadAir: {
    primarySlot: 'extra',
    slots: ['extra'],
    label: '15分で初コメが来ないと',
    icon: 'Bomb',
    description: 'test',
  },
  GiftRanking: {
    primarySlot: 'extra',
    slots: ['extra'],
    label: 'ギフトランキング',
    icon: 'Gift',
    description: 'ギフトランキングを表示します',
  },
} as const
