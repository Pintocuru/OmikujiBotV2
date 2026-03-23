// src/types/MetaMaps/ServiceTriggerMaps.ts

/**
 * 比較条件のUI表示情報（label + description）
 */
export const serviceConditionMap = {
  changed: {
    label: '変化した',
    description: '前回の値と異なる場合に条件を満たします',
  },
  increased: {
    label: '増えた',
    description: '前回の値より増加した場合に条件を満たします',
  },
  decreased: {
    label: '減った',
    description: '前回の値より減少した場合に条件を満たします',
  },
  greaterThanPeak: {
    label: 'ピーク値を超えた',
    description: '過去最高値を超えた場合に条件を満たします',
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
 * MetaSimpleComparisonCondition の部分マップ（greaterThanPeakを除く）
 */
export const serviceSimpleComparisonConditionMap = {
  changed: serviceConditionMap.changed,
  increased: serviceConditionMap.increased,
  decreased: serviceConditionMap.decreased,
  lowerBound: serviceConditionMap.lowerBound,
  upperBound: serviceConditionMap.upperBound,
  equal: serviceConditionMap.equal,
  loop: serviceConditionMap.loop,
} as const

/**
 * トリガー条件の表示名マップ（絵文字付き）
 */
export const serviceTriggerConditionMap = {
  upVote: '👍 高評価',
  viewer: '👀 視聴者数',
  follower: '⭐ 登録者数',
  elapsedMinutes: '⏱ 配信経過時間',
} as const
