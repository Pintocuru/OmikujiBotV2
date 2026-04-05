// src/types/OmikujiData/UiSettings/DeadAirSchema.ts
import { z } from 'zod'

export const deadComponentMap = {
  bomb: { label: '爆弾', accessLevel: 'pro' },
} as const
const deadComponentValues = Object.keys(deadComponentMap) as DeadComponent[]
export type DeadComponent = keyof typeof deadComponentMap

const DeadEventRuleSchema = z.object({
  counterKey: z.string().default('').catch(''),
  effect: z.enum(['timer', 'life']).default('timer').catch('timer'),
  value: z.number().min(1).max(10).default(1).catch(1),
  threshold: z.number().min(1).default(1).catch(1),
})
export type DeadEventRuleType = z.infer<typeof DeadEventRuleSchema>

/**
 * obstacle: 背景色を決める「妨害するもの」。
 * 将来的に 'black' | 'white' | (characterKey) を受け入れる想定。
 */
export const DeadAirSchema = z.object({
  component: z.enum(deadComponentValues).default('bomb').catch('bomb'),
  obstacle: z.enum(['black', 'white']).default('black').catch('black'),

  initialMinutes: z.number().min(1).max(60).default(5).catch(5),
  initialLives: z.number().min(3).max(10).default(3).catch(3),

  bonusEnabled: z.boolean().default(false).catch(false),

  eventRules: z.array(DeadEventRuleSchema).default([]).catch([]),

  optionalCounterKey: z.string().nullable().default(null).catch(null),
})
export type DeadAirType = z.infer<typeof DeadAirSchema>
