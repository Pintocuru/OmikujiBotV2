// src/types/OmikujiData/UiSettings/SettingsLiverSchema.ts
import { z } from 'zod'

/**
 * ライバーカウンターコンポーネントの表示名マップ
 */
export const deadComponentMap = {
  bomb: '爆弾',
} as const
const deadComponentValues = Object.keys(deadComponentMap) as DeadComponent[]
export type DeadComponent = keyof typeof deadComponentMap

// イベントルール：どのカウンターキーが、何の効果を、いくつ持つか
const DeadEventRuleSchema = z.object({
  counterKey: z.string().default('').catch(''), // counters のキー
  effect: z.enum(['timer', 'life']).default('timer').catch('timer'),
  value: z.number().min(1).max(10).default(1).catch(1), // 増加量（timer は分単位）
  threshold: z.number().min(1).default(1).catch(1), // 発動しきい値
})
export type DeadEventRuleType = z.infer<typeof DeadEventRuleSchema>

/**
 * 15分後に初コメが来ないと DeadAir
 */

export const SettingsDeadSchema = z.object({
  component: z.enum(deadComponentValues).default('bomb').catch('bomb'),
  bgColor: z.enum(['black', 'white']).default('black').catch('black'),

  initialMinutes: z.number().min(1).max(60).default(5).catch(5),
  initialLives: z.number().min(3).max(10).default(3).catch(3),

  bonusEnabled: z.boolean().default(false).catch(false),

  eventRules: z.array(DeadEventRuleSchema).default([]).catch([]),

  optionalCounterKey: z.string().nullable().default(null).catch(null),
})
export type SettingsDeadType = z.infer<typeof SettingsDeadSchema>
