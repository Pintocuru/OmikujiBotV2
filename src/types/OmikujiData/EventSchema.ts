// src/types/OmikujiData/EventSchema.ts
import { z } from 'zod'
import { OmikujiSetSchema } from './OmikujiSchema'
import { CommentTriggerSchema } from './CommentTriggerSchema'
import { MetaTriggerSchema } from './MetaTriggerSchema'
import { normalizedObject } from './ParsedDefault'
import { BaseRecordSchema } from '@shared/types/'

/**
 * おみくじ制限設定のスキーマ
 */
export const OmikujiLimitsSchema = z.object({
  // 重複制限
  cooldownSeconds: z.number().min(0).max(300).catch(3), // 処理クールダウン時間（秒）、0で無効
  cooldownMessage: z.string().nullish().default(null).catch(null),

  // 連投制限
  isRepeatAllowed: z.number().default(0).catch(0),
  repeatMessage: z.string().nullish().default(null).catch(null),
})
export type OmikujiLimitsType = z.infer<typeof OmikujiLimitsSchema>

/**
 * Rules のカテゴリ定数セット
 */
export const rulesCategoryLabel = ['comments', 'timers', 'metas'] as const
export type RulesCategoryType = (typeof rulesCategoryLabel)[number]

/**
 * Rules 共通部分のスキーマ
 */
export const BaseRuleSchema = z.object({
  ...BaseRecordSchema.shape,
  omikuji: OmikujiSetSchema,
})

/**
 * comments スキーマ
 */
export const CommentRuleSchema = z.object({
  ...BaseRuleSchema.shape,
  // TODO(v3) : ruleType -> kind
  ruleType: z.literal('comments').default('comments'),
  trigger: normalizedObject(CommentTriggerSchema),
  limits: normalizedObject(OmikujiLimitsSchema),
})
export type CommentRuleType = z.infer<typeof CommentRuleSchema>

/**
 * timers スキーマ
 */
export const TimerRuleSchema = z.object({
  ...BaseRuleSchema.shape,
  // TODO(v3) : ruleType -> kind
  ruleType: z.literal('timers').default('timers'), // イベントタイプ（タイマー）
  mode: z.enum(['interval', 'onStart']).default('interval'), // モード

  // 間隔時間（秒）
  intervalSeconds: z
    .number()
    .min(30)
    .max(60 * 60)
    .default(60 * 5)
    .catch(60 * 5),
  isBaseZero: z.boolean().default(false).catch(false), // 0時0分を基準にするか
})
export type TimerRuleType = z.infer<typeof TimerRuleSchema>

/**
 * metas スキーマ
 */
export const MetaRuleSchema = z.object({
  ...BaseRuleSchema.shape,
  // TODO(v3) : ruleType -> kind
  ruleType: z.literal('metas').default('metas'),
  trigger: normalizedObject(MetaTriggerSchema),
})
export type MetaRuleType = z.infer<typeof MetaRuleSchema>

/**
 * 型
 */
export type RuleType = CommentRuleType | TimerRuleType | MetaRuleType
