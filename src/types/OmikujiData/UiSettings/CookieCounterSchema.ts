// src/types/OmikujiData/UiSettings/CookieCounterSchema.ts
import { z } from 'zod'
import { DaisyUiThemeFieldsSchema } from '@shared/styles/DaisyUiTheme'
import { normalizedObject } from '../ParsedDefault'

/**
 * ライブクロック LiveClock
 */
export const hogeMap = {
  sakura: {
    label: 'さくらツイン🌸',
    kazu: 2,
    isColor: false,
  },
} as const

export const cookieComponentMap = {
  sakura: 'さくらツイン🌸',
} as const

const cookieComponentsEnum = Object.keys(cookieComponentMap) as CookieComponent[]
export type CookieComponent = keyof typeof cookieComponentMap

// カウンターの種類
/**
type:
 default:高評価・閲覧数など、storeから取得できる値
  event: コメントイベントから取得する値
  variable : 変数プレースホルダーから取得する値
   


 */

export const CookieCounterSchema = z.object({
  component: z.enum(cookieComponentsEnum).default('sakura').catch('sakura'), // カウンタースタイル
  color: normalizedObject(DaisyUiThemeFieldsSchema),

  // 任意のカウンターは3つまで
  counter1: z.enum(streamDefaultKeyLabels).default('syoken').catch('syoken'), // デフォルトカウンター（6種から選ぶ、順序なし）
  counter2: z.enum(streamDefaultKeyLabels).default('syoken').catch('syoken'), // デフォルトカウンター（6種から選ぶ、順序なし）
  counter3: z.enum(streamDefaultKeyLabels).default('syoken').catch('syoken'), // デフォルトカウンター（6種から選ぶ、順序なし）
  eventCounters: z.array(z.string()).max(8).default([]).catch([]), // event カウンター CommentRuleSchema.key
})
export type CookieCounterType = z.infer<typeof CookieCounterSchema>
