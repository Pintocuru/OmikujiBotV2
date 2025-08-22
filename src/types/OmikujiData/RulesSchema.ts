// shared/types/OmikujiBot/RulesSchema.ts
import { z } from 'zod'
import { BaseRecordSchema, CommentThresholdSchema } from '@shared/types/'
import { OmikujiSetSchema } from './OmikujiSchema'

/**
 * おみくじ制限設定のスキーマ
 */
export const OmikujiLimitsSchema = z.object({
  // 重複処理
  cooldownSeconds: z.number().min(0).max(300).catch(3), // 処理クールダウン時間（秒）、0で無効
  cooldownMessage: z.string().optional(),

  // 回数制限
  drawLimit: z.number().default(0).catch(0), // 今回のおみくじはこの回数以下か
  drawLimitExceeded: z.enum(['doNothing', 'showMessage', 'showLastResult']).default('showMessage').catch('showMessage'),
  drawLimitMessage: z.string().optional(),

  // 連投制限
  isRepeatAllowed: z.boolean().default(true).catch(true), // 連投を許可するか
  repeatMessage: z.string().optional(),
})

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
  ruleType: z.literal('comments').default('comments').catch('comments'), // ルールタイプ（コメント）
  threshold: CommentThresholdSchema.default(
    CommentThresholdSchema.parse({
      conditions: ['comment'],
      comment: ['おみくじ'],
    })
  ).catch(CommentThresholdSchema.parse({})), // コメント発火条件
  scriptId: z.union([z.string(), z.null()]).default(null).catch(null), // 関連するスクリプトID
  scriptParams: z.record(z.string(), z.any()).nullable().default(null).catch(null), // スクリプトパラメータ
  limits: OmikujiLimitsSchema.catch(OmikujiLimitsSchema.parse({})), // おみくじ実行制限設定
})

/**
 * timers スキーマ
 */
export const TimerRuleSchema = z.object({
  ...BaseRuleSchema.shape,
  ruleType: z.literal('timers').default('timers').catch('timers'), // ルールタイプ（タイマー）
  // 間隔時間（秒）
  intervalSeconds: z
    .number()
    .min(5)
    .max(60 * 60)
    .default(60 * 5)
    .catch(60 * 5),
  isBaseZero: z.boolean().default(false).catch(false), // 0時0分を基準にするか
})

/**
 * 型
 */
export type OmikujiLimitsType = z.infer<typeof OmikujiLimitsSchema>
export type CommentRuleType = z.infer<typeof CommentRuleSchema>
export type TimerRuleType = z.infer<typeof TimerRuleSchema>
export type RuleType = CommentRuleType | TimerRuleType
