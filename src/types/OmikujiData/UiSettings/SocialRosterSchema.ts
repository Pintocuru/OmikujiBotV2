// src/types/OmikujiData/UiSettings/SettingsSocialSchema.ts
import { z } from 'zod'
import { DaisyUiThemeFieldsSchema, themes } from '@shared/styles/DaisyUiTheme'
import { statKeyNum } from './FlightSeatSchema'
import { normalizedObject } from '../ParsedDefault'

/**
 * socialRoster ソーシャルゲーム風ユーザーリスト の表示名マップ
 */
export const socialComponentMap = {
  grid: { label: '無地グリッド', accessLevel: 'basic', isColor: false },
  streamPower: { label: '配信戦闘力', accessLevel: 'adv', isColor: true },
} as const

/**
 * ソーシャルゲーム風ユーザーリスト socialRoster
 */
export type SocialComponent = keyof typeof socialComponentMap
export const socialSortKeys = ['lastVisit', 'giftPrice', 'tc', 'no', 'isSyoken'] as const
export type SocialSortKey = (typeof socialSortKeys)[number]

export const SocialRosterSchema = z.object({
  component: z
    .enum(Object.keys(socialComponentMap) as [SocialComponent])
    .default('grid')
    .catch('grid'),

  // どのeventを対象にするか。空文字なら全体から
  targetEventKey: z.string().default('').catch(''),

  color: normalizedObject(DaisyUiThemeFieldsSchema), // DaisyUIテーマカラー

  // セルに表示する値
  statKey: z.enum(statKeyNum).nullable().default(null).catch(null),

  // ソート基準・順序
  sortKey: z.enum(socialSortKeys).default('lastVisit').catch('lastVisit'),
})
export type SocialRosterType = z.infer<typeof SocialRosterSchema>
