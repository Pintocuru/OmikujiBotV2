// src/types/MetaMaps/DefaultPlaceholderMaps.ts
import { serviceMetaConditionMap } from '@shared/types/'
import { countUnitConditionMap } from '@shared/types/trigger'

/**
 * プレースホルダー一覧
 * slot:'comment', (コメントイベントのみ)と、 slot:'event', (全体)
 */
export const defaultPlaceholderMap = {
  user: { slot: 'comment', label: 'コメントしたユーザー', short: '[ユーザー名]' },
  userId: { slot: 'comment', label: 'コメントしたユーザーID', short: '[ユーザーID]' },
  price: { slot: 'comment', label: 'ギフト金額', short: '[ギフト金額]' },
  commenter: { slot: 'event', label: 'コメントをしたユーザー数', short: '[コメントしたユーザー数]' },
  syoken: { slot: 'event', label: '初見さんの数', short: '[初見さん数]' },
  winner: { slot: 'event', label: 'コメントをしたランダムなユーザー', short: '[ランダムユーザー]' },

  lc: { slot: 'comment', label: countUnitConditionMap.lc.label, short: '[配信コメント数]' },
  tc: { slot: 'comment', label: countUnitConditionMap.tc.label, short: '[個人コメント数]' },
  draws: { slot: 'comment', label: countUnitConditionMap.draws.label, short: '[おみくじ発動回数]' },

  viewer: { slot: 'event', label: serviceMetaConditionMap.viewer.label, short: '[視聴者数]' },
  upVote: { slot: 'event', label: serviceMetaConditionMap.upVote.label, short: '[高評価数]' },
  follower: { slot: 'event', label: serviceMetaConditionMap.follower.label, short: '[登録者数]' },
} as const

/**
 * 省略形（短い）ラベル
 */
type DefaultPlaceholders = keyof typeof defaultPlaceholderMap
export const defaultPlaceholdersShortLabels: Record<DefaultPlaceholders, string> = Object.fromEntries(
  Object.entries(defaultPlaceholderMap).map(([k, v]) => [k, v.short])
) as Record<DefaultPlaceholders, string>
