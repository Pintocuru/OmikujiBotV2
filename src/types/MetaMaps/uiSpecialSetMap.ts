// src/types/MetaMaps/UiSpecialSetMap.ts

// specialSet
export const uiSpecialSetMap = {
  OmikujiBot: {
    label: 'おみくじBOT',
    description: 'フキダシ＋トースト＋ランキングのセット',
    kinds: ['bubble', 'toast', 'ranking'],
  },
  VarietySlot: {
    label: 'VarietySlot',
    description: 'コメントスロット＋ランキングのセット',
    kinds: ['commentSpin', 'ranking'],
  },
  GogoBonus: {
    label: 'ペカるボタン',
    description: 'コメントスロット＋クッキーカウンターのセット',
    kinds: ['commentSpin', 'cookieCounter'],
  },
  Golden65536: {
    label: 'ゴールデン65536',
    description: 'コメントスロット＋ライバーカウンターのセット',
    kinds: ['commentSpin', 'streamCounter'],
  },
} as const
