// src/types/OmikujiData/UiSettings/GiftRankingSchema.ts
import { z } from 'zod'
import { themes } from '@shared/styles/DaisyUiTheme'

/**
 * ランキング GiftRanking
 */
// ランキングコンポーネントの選択肢
export const giftComponentMap = {
  grid: {
    label: '無地',
    accessLevel: 'godMode',
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

export const GiftRankingSchema = z.object({
  component: z.enum(giftComponentsEnum).default('grid').catch('grid'),
  color: z.enum(themes).default('lofi').catch('lofi'),
  rankingLimit: z.number().int().min(1).max(100).default(10).catch(10), // 件数
  sortOrder: z.enum(giftSortOrder).default('new').catch('new'),
  minimumAmount: z.number().int().min(0).default(0).catch(0), // 最低金額
})
export type GiftRankingType = z.infer<typeof GiftRankingSchema>
