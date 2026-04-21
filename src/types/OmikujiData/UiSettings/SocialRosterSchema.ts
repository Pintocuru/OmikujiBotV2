// src/types/OmikujiData/UiSettings/SocialRosterSchema.ts
import { z } from 'zod'
import { DaisyUiThemeFieldsSchema } from '@shared/styles/DaisyUiTheme'
import { normalizedObject } from '../ParsedDefault'

/**
 * socialRoster ソーシャルゲーム風ユーザーリスト の表示名マップ
 */
export const socialComponentMap = {
  grid: {
    label: '無地グリッド',
    accessLevel: 'basic',
    isColor: false,
  },
  streamPower: {
    label: '配信戦闘力',
    accessLevel: 'pro',
    isColor: true,
  },
} as const
const socialComponentEnum = Object.keys(socialComponentMap) as SocialComponent[]
export type SocialComponent = keyof typeof socialComponentMap

export const socialSortKeyMap = {
  lastVisit: 'なし',
  isSyoken: '初見',
  userName: 'ユーザー名(ソートなし)',
  giftPrice: 'ギフト金額',
  tc: '総チャット数(ソートなし)',
  no: '配信内チャット数',
} as const

const socialSortKeyEnum = Object.keys(socialSortKeyMap) as SocialSortKey[]
export type SocialSortKey = keyof typeof socialSortKeyMap

export const SocialRosterSchema = z.object({
  component: z.enum(socialComponentEnum).default('grid').catch('grid'),
  targetEventKey: z.string().default('').catch(''), // どのeventを対象にするか
  color: normalizedObject(DaisyUiThemeFieldsSchema), // DaisyUIテーマカラー
  sortKey: z.enum(socialSortKeyEnum).default('lastVisit').catch('lastVisit'), // ソート基準・順序
  // 縦・横のアイコン上限数
  layoutLimit: z
    .object({
      maxRows: z.number().int().positive().nullable().default(null).catch(null),
      maxColumns: z.number().int().positive().nullable().default(null).catch(null),
    })
    .default({ maxRows: null, maxColumns: null }),
})
export type SocialRosterType = z.infer<typeof SocialRosterSchema>

export type SocialRosterCounts = {
  streamScore: number // 配信戦闘力
  syokenCount: number // 初見数
  userCount: number // ユーザー数
}
