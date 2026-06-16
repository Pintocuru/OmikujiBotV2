// src/types/OmikujiData/UiSettings/GiftRankingSchema.ts
import { z } from 'zod'
import { themes } from '@shared/styles/DaisyUiTheme'

/**
 * ランキング GiftRanking
 */
export const giftComponentMap = {
  grid: {
    label: '無地',
    accessLevel: 'godMode',
    isOption: true,
  },
  standard: {
    label: 'スタンダード',
    accessLevel: 'godMode',
    isOption: true,
  },
  list: {
    label: 'リスト',
    accessLevel: 'godMode',
    isOption: true,
  },
  scroll: {
    label: '横スクロール',
    accessLevel: 'godMode',
    isOption: true,
  },
  podium: {
    label: '表彰台',
    accessLevel: 'godMode',
    isOption: true, // 1〜3位は固定表示のため非対応
  },
} as const
const giftComponentsEnum = Object.keys(giftComponentMap) as GiftComponent[]
export type GiftComponent = keyof typeof giftComponentMap

//
export const giftSortOrderMap = {
  new: '新着順',
  high: '金額が高い順',
} as const
const giftSortOrder = Object.keys(giftSortOrderMap) as GiftSortOrder[]
export type GiftSortOrder = keyof typeof giftSortOrderMap

// displayOptions
export const giftDisplayOptionsMap = {
  avatar: { label: 'アイコン' },
  name: { label: 'ユーザー名' },
  amount: { label: '金額' },
  rank: { label: '順位バッジ' },
} as const
export type GiftDisplayOption = keyof typeof giftDisplayOptionsMap
const giftDisplayOptionKeys = Object.keys(giftDisplayOptionsMap) as [GiftDisplayOption, ...GiftDisplayOption[]]

export const GiftRankingSchema = z.object({
  component: z.enum(giftComponentsEnum).default('grid').catch('grid'),
  color: z.enum(themes).default('lofi').catch('lofi'),
  rankingLimit: z.number().int().min(1).max(100).default(10).catch(10), // 件数
  sortOrder: z.enum(giftSortOrder).default('new').catch('new'),
  minimumAmount: z.number().int().min(0).default(0).catch(0), // 最低金額
  iconSize: z.number().default(80).catch(80),
  displayOptions: z
    .array(z.enum(giftDisplayOptionKeys))
    .default(['avatar', 'name', 'amount', 'rank'])
    .catch(['avatar', 'name', 'amount', 'rank']),
})
export type GiftRankingType = z.infer<typeof GiftRankingSchema>
