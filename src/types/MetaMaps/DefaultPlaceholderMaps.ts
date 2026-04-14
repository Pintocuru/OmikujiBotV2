// src/types/MetaMaps/DefaultPlaceholderMaps.ts
import { serviceMetaConditionMap } from '@shared/types/'
import { countUnitConditionMap } from '@shared/types/trigger'

/**
 * プレースホルダー一覧
 * slot:'comment', (コメントイベントのみ)と、 slot:'event', (全体)
 */
export const defaultBasePlaceholderLabel = [
  'viewer',
  'upVote',
  'follower',
  'lc',
  'commenter',
  'syoken',
  'winner',
  'clock',
] as const
export const defaultPlaceholderLabel = [...defaultBasePlaceholderLabel, 'user', 'userId', 'price', 'tc', 'draws']

export const defaultPlaceholderMap = {
  user: { slot: 'comment', label: 'コメントしたユーザー', short: 'User_Name' },
  userId: { slot: 'comment', label: 'コメントしたユーザーID', short: 'test_userId' },
  price: { slot: 'comment', label: 'ギフト金額', short: 'Gift_Price' },
  commenter: { slot: 'event', label: 'コメントをしたユーザー数', short: 'Commenter_Count' },
  syoken: { slot: 'event', label: '初見さんの数', short: 'Syoken_Count' },
  winner: { slot: 'event', label: 'コメントをしたランダムなユーザー', short: 'Winner_Name' },
  winnerId: { slot: 'event', label: 'コメントをしたランダムなユーザーID', short: 'test_userId' },
  clock: { slot: 'event', label: '現在時刻', short: 'Clock_Time' },

  lc: { slot: 'comment', label: countUnitConditionMap.lc.label, short: 'LiveComment_Count' },
  tc: { slot: 'comment', label: countUnitConditionMap.tc.label, short: 'TotalComment_Count' },
  draws: { slot: 'comment', label: countUnitConditionMap.draws.label, short: 'Omikuji_Draws_Count' },

  viewer: { slot: 'event', label: serviceMetaConditionMap.viewer.label, short: 'Viewer_Count' },
  upVote: { slot: 'event', label: serviceMetaConditionMap.upVote.label, short: 'UpVote_Count' },
  follower: { slot: 'event', label: serviceMetaConditionMap.follower.label, short: 'Subscribe_Count' },
} as const

/**
 * 省略形（短い）ラベル
 */
type DefaultPlaceholders = keyof typeof defaultPlaceholderMap
export const defaultPlaceholdersShortLabels: Record<DefaultPlaceholders, string> = Object.fromEntries(
  Object.entries(defaultPlaceholderMap).map(([k, v]) => [k, v.short])
) as Record<DefaultPlaceholders, string>
