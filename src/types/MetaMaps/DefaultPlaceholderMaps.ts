// src/types/MetaMaps/DefaultPlaceholderMaps.ts
import { serviceMetaConditionMap } from '@shared/types/'
import { countUnitConditionMap } from '@shared/types/trigger'

export const defaultPlaceholderMap = {
  user: {
    label: 'コメントしたユーザー',
    short: '[ユーザー名]',
  },
  userId: {
    label: 'コメントしたユーザーID',
    short: '[ユーザーID]',
  },
  price: {
    label: 'ギフト金額',
    short: '[ギフト金額]',
  },
  commenter: {
    label: 'コメントをしたユーザー数',
    short: '[コメントしたユーザー数]',
  },
  winner: {
    label: 'コメントをしたランダムなユーザー',
    short: '[ランダムユーザー]',
  },

  lc: {
    label: countUnitConditionMap.lc.label,
    short: '[配信コメント数]',
  },
  tc: {
    label: countUnitConditionMap.tc.label,
    short: '[個人コメント数]',
  },
  draws: {
    label: countUnitConditionMap.draws.label,
    short: '[おみくじ発動回数]',
  },

  viewer: {
    label: serviceMetaConditionMap.viewer.label,
    short: '[視聴者数]',
  },
  upVote: {
    label: serviceMetaConditionMap.upVote.label,
    short: '[高評価数]',
  },
} as const

/**
 * 省略形（短い）ラベル
 */
type DefaultPlaceholders = keyof typeof defaultPlaceholderMap
export const defaultPlaceholdersShortLabels: Record<DefaultPlaceholders, string> = Object.fromEntries(
  Object.entries(defaultPlaceholderMap).map(([k, v]) => [k, v.short])
) as Record<DefaultPlaceholders, string>
