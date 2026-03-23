// src/types/MetaMaps/MetaTriggerMaps.ts

/**
 * 比較条件のUI表示情報（label + description）Reaction
 */
export const reactionConditionMap = {
  increased: {
    label: '増えた',
    description: '前回の値より増加した場合に条件を満たします',
  },
  burst: {
    label: 'バースト',
    description: '30秒以内に指定値以上のリアクションがあった場合に条件を満たします',
  },
  lowerBound: {
    label: '指定値以上',
    description: '指定値以上の場合に条件を満たします',
  },
  upperBound: {
    label: '指定値以下',
    description: '指定値以下の場合に条件を満たします',
  },
  equal: {
    label: '指定値と等しい',
    description: '指定値と等しい場合に条件を満たします',
  },
  loop: {
    label: 'ループ',
    description: '指定値の倍数の時に条件を満たします（例：10増えるごと）',
  },
} as const

/**
 * トリガー条件の表示名マップ（絵文字付き）
 */
export const reactionMap = {
  youtube: {
    heart: '🧡',
    smile: '😄',
    celebrate: '🎉',
    surprise: '😳',
    praise: '💯',
  },
  // tiktok: { ... },
} as const
