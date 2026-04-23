// src/types/MetaMaps/UiSpecialSetMap.ts

// specialSet
export const uiSpecialSetMap = {
  OmikujiBot: {
    label: 'おみくじBOT',
    description: 'フキダシ＋トースト＋ランキングのセット',
    kinds: ['bubble', 'toast', 'ranking'],
  },
  VarietySlot: {
    label: 'クイズせかいはバラエティスロット',
    description: 'クイズせかいはバラエティスロット用のセット',
    kinds: ['commentSpin', 'cookieCounter'],
  },
  VarietySlotRanking: {
    label: 'バラエティスロットランキング',
    description: 'クイズせかいはバラエティスロットランキング用のセット',
    kinds: ['commentSpin', 'cookieCounter', 'ranking'],
  },
  GogoBonus: {
    label: 'ペカるLAMP',
    description: 'ペカるLAMP用のセット',
    kinds: ['commentSpin', 'cookieCounter'],
  },
  Golden65536: {
    label: 'ゴールデン65536',
    description: 'コメントスロット＋ライバーカウンターのセット',
    kinds: ['commentSpin', 'streamCounter'],
  },
} as const
