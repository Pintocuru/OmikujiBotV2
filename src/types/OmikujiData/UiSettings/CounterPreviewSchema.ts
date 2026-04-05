// src/types/OmikujiData/UiSettings/CounterPreviewSchema.ts
import { z } from 'zod'
import { DaisyUiThemeFieldsSchema } from '@shared/styles/DaisyUiTheme'
import { normalizedObject } from '../ParsedDefault'

/**
 * カウンターコンポーネントの表示名マップ
 */
export const counterComponentMap = {
  counterUser: {
    label: 'カウンター+最後のユーザー',
    accessLevel: 'pro',
  },
  counterTimer: {
    label: '最後のユーザーからの経過時間',
    accessLevel: 'pro',
  },
  userList: {
    label: 'ユーザーリスト(バッジ)',
    accessLevel: 'pro',
  },
  UserCardScroller: {
    label: 'ユーザーリスト(縦型)',
    accessLevel: 'pro',
  },
} as const

/**
 * カウンター・ユーザーリスト Counter
 */
const counterComponentValues = Object.keys(counterComponentMap) as CounterComponent[]
export type CounterComponent = keyof typeof counterComponentMap

export const CounterPreviewSchema = z.object({
  component: z.enum(counterComponentValues).default('counterUser').catch('counterUser'),
  targetEventKey: z.string().default('').catch(''), // どのruleを対象にするか
  target: z.enum(['draw', 'user']).default('draw').catch('draw'), // 対象は回数かユーザー数か
  label: z.string().default('Counter').catch('Counter'), // カウンターのラベル
  color: normalizedObject(DaisyUiThemeFieldsSchema), // DaisyUIテーマカラー
})
export type CounterPreviewType = z.infer<typeof CounterPreviewSchema>
