// src/types/OmikujiData/UiSettings/SettingsSocialSchema.ts
import { z } from 'zod'
import { themes } from '@shared/styles/DaisyUiTheme'
import { statKeyNum } from './FlightSeatSchema'

/**
 * socialRoster ソーシャルゲーム風ユーザーリスト の表示名マップ
 */
export const socialComponentMap = {
  grid: 'ソーシャルグリッド',
} as const

/**
 * ソーシャルゲーム風ユーザーリスト socialRoster
 */
export type SocialComponent = keyof typeof socialComponentMap
export const socialSortKeys = ['tc', 'no', 'isSyoken', 'lastVisit', 'giftPrice'] as const
export type SocialSortKey = (typeof socialSortKeys)[number]

export const SocialRosterSchema = z.object({
  component: z
    .enum(Object.keys(socialComponentMap) as [SocialComponent])
    .default('grid')
    .catch('grid'),

  // セルサイズ（Tailwindクラスで指定）
  cellSize: z.enum(['h-8', 'h-10', 'h-12', 'h-16', 'h-20', 'h-24']).default('h-16').catch('h-16'),

  // どのeventを対象にするか。空文字なら全体から
  targetEventKey: z.string().default('').catch(''),

  label: z.string().default('').catch(''),
  color: z.enum(themes).default('lofi').catch('lofi'),

  // セルに表示する値
  statKey: z.enum(statKeyNum).nullable().default(null).catch(null),

  // ソート基準・順序
  sortKey: z.enum(socialSortKeys).default('lastVisit').catch('lastVisit'),
  sortOrder: z.enum(['desc', 'asc']).default('desc').catch('desc'),
})
export type SocialRosterType = z.infer<typeof SocialRosterSchema>
