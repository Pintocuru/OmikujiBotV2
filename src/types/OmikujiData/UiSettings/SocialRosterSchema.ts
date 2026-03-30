// src/types/OmikujiData/UiSettings/SettingsSocialSchema.ts
import { z } from 'zod'
import { DaisyUiThemeFieldsSchema } from '@shared/styles/DaisyUiTheme'
import { normalizedObject } from '../ParsedDefault'

/**
 * socialRoster ソーシャルゲーム風ユーザーリスト の表示名マップ
 */
export const socialComponentMap = {
  grid: { label: '無地グリッド', accessLevel: 'basic', isColor: false },
  streamPower: { label: '配信戦闘力', accessLevel: 'adv', isColor: true },
} as const
export type SocialComponent = keyof typeof socialComponentMap

export const socialSortKeyMap = {
  lastVisit: 'なし',
  isSyoken: '初見',
  userName: 'ユーザー名',
  giftPrice: 'ギフト金額',
  tc: '総チャット数',
  no: '配信内チャット数',
} as const

const socialSortKeyEnum = Object.keys(socialSortKeyMap) as SocialSortKey[]
export type SocialSortKey = keyof typeof socialSortKeyMap

export const SocialRosterSchema = z.object({
  component: z
    .enum(Object.keys(socialComponentMap) as [SocialComponent])
    .default('grid')
    .catch('grid'),

  // どのeventを対象にするか。空文字なら全体から
  targetEventKey: z.string().default('').catch(''),

  color: normalizedObject(DaisyUiThemeFieldsSchema), // DaisyUIテーマカラー

  // ソート基準・順序
  sortKey: z.enum(socialSortKeyEnum).default('lastVisit').catch('lastVisit'),
})
export type SocialRosterType = z.infer<typeof SocialRosterSchema>
