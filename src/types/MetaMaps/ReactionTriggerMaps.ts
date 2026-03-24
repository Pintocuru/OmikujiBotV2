// src/types/MetaMaps/ReactionTriggerMaps.ts

/**
 * 比較条件のUI表示情報（label + description）Reaction
 */
export const reactionConditionMap = {
  milestone: {
    label: '増加した',
    description: '累計がnの倍数に達するたびに発火します（例：100回ごと）',
  },
  burstSustain: {
    label: '増加した(レベル参照)',
    description: '指定レベル以上の間、n回押されるたびに発火します',
  },
  equal: {
    label: '指定値と等しい',
    description: '累計が指定値にぴったり一致したとき1回だけ発火します',
  },
  burstReach: {
    label: 'レベルアップ時',
    description: '指定レベル以上に到達した瞬間に1回だけ発火します',
  },
  burstDrop: {
    label: 'レベルダウン時',
    description: '指定レベル以下に下がった瞬間に1回だけ発火します',
  },
} as const

/**
 * リアクション絵文字マップ
 */
export const reactionMap = {
  youtube: {
    heart: '🧡',
    smile: '😄',
    celebrate: '🎉',
    surprise: '😳',
    praise: '💯',
  },
} as const
