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
    label: '得点表記付きスロット',
    description: 'コメントスロット＋クッキーカウンターのセット',
    kinds: ['commentSpin', 'cookieCounter'],
  },
} as const
