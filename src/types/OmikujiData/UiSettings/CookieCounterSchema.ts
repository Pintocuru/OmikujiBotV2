// src/types/OmikujiData/UiSettings/CookieCounterSchema.ts
import { z } from 'zod'
import { DaisyUiThemeFieldsSchema } from '@shared/styles/DaisyUiTheme'
import { normalizedObject } from '../ParsedDefault'
import { streamDefaultKeyLabels } from './StreamCounterSchema'
import { idSchema } from '@shared/types'

/**
 * ライブクロック LiveClock
 */

// カウンターの種類
export const cookieComponentMap = {
  sakura: {
    label: 'さくらツイン🌸',
    maxCounters: 2,
    isColor: false,
  },
  // 追加例
  single: {
    label: 'シングル🍪',
    maxCounters: 1,
    isColor: true,
  },
} as const

export type CookieComponent = keyof typeof cookieComponentMap
export const cookieComponentsEnum = Object.keys(cookieComponentMap) as CookieComponent[]

// カウントする対象
export const CookieCounterCountersSchema = z.discriminatedUnion('type', [
  z.object({
    id: idSchema,
    type: z.literal('default').default('default'),
    target: z.enum(streamDefaultKeyLabels).default('syoken'),
    isMax: z.boolean().optional(),
  }),
  z.object({
    id: idSchema,
    type: z.literal('event').default('event'),
    target: z.string(),
    label: z.string(),
  }),
  z.object({
    id: idSchema,
    type: z.literal('variable').default('variable'),
    target: z.string(),
    label: z.string(),
  }),
])

export const CookieCounterSchema = z.object({
  component: z.enum(cookieComponentsEnum).default('sakura').catch('sakura'), // カウンタースタイル
  color: normalizedObject(DaisyUiThemeFieldsSchema),
  counters: z.array(CookieCounterCountersSchema).max(8).default([]), // 任意のカウンター
})
export type CookieCounterType = z.infer<typeof CookieCounterSchema>
