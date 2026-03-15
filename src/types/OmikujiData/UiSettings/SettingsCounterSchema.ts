// src/types/OmikujiData/UiSettings/SettingsCounterSchema.ts
import { z } from 'zod'
import { DaisyUiThemeFieldsSchema } from '@shared/styles/DaisyUiTheme'
import { normalizedObject } from '../ParsedDefault'

/**
 * カウンターコンポーネントの表示名マップ
 */
export const counterComponentMap = {
  counterUser: 'カウンター+最後のユーザー',
  counterTimer: '最後のユーザーからの経過時間',
  userList: 'ユーザーリスト(バッジ)',
  UserCardScroller: 'ユーザーリスト(縦型)',
} as const

/**
 * カウンター・ユーザーリスト Counter
 */
const counterComponentValues = Object.keys(counterComponentMap) as CounterComponent[]
export type CounterComponent = keyof typeof counterComponentMap

export const SettingsCounterSchema = z.object({
  component: z.enum(counterComponentValues).default('counterUser').catch('counterUser'),
  targetEventKey: z.string().default('').catch(''), // どのruleを対象にするか
  target: z.enum(['draw', 'user']).default('draw').catch('draw'), // 対象は回数かユーザー数か
  label: z.string().default('Counter').catch('Counter'), // カウンターのラベル
  color: normalizedObject(DaisyUiThemeFieldsSchema), // DaisyUIテーマカラー
})
export type SettingsCounterType = z.infer<typeof SettingsCounterSchema>
