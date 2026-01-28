// src\types\OmikujiData\RulesSchema.ts
import { z } from 'zod'
import { OmikujiSetSchema } from './OmikujiSchema'
import { CommentTriggerSchema } from '../OmikujiProcess/CommentTriggerSchema'
import { BaseRecordSchema } from '@shared/types/'
import { MetaTriggerSchema } from '../OmikujiProcess/MetaTriggerSchema'

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
  ruleType: z.literal('comments').default('comments').catch('comments'),
  trigger: CommentTriggerSchema.default(CommentTriggerSchema.parse({})).catch(CommentTriggerSchema.parse({})),
  limits: OmikujiLimitsSchema.catch(OmikujiLimitsSchema.parse({})),
})
export type CommentRuleType = z.infer<typeof CommentRuleSchema>

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
export type TimerRuleType = z.infer<typeof TimerRuleSchema>

/**
 * metas スキーマ
 */
export const MetaRuleSchema = z.object({
  ...BaseRuleSchema.shape,
  ruleType: z.literal('metas').default('metas').catch('metas'),
  trigger: MetaTriggerSchema.default(MetaTriggerSchema.parse({})).catch(MetaTriggerSchema.parse({})),
})
export type MetaRuleType = z.infer<typeof MetaRuleSchema>

/**
 * 型
 */
export type RuleType = CommentRuleType | TimerRuleType | MetaRuleType

/**

metas の新規導入について

export const MetaRuleSchema = z.object({
  ...BaseRuleSchema.shape,
  ruleType: z.literal('metas').default('metas').catch('metas'),
  trigger: TriggerMetaSchema.default(TriggerMetaSchema.parse({})).catch(TriggerMetaSchema.parse({})),
})



  startTime: number | null // metaで取得した配信開始時間(Date)
  upVote: number // metaで取得した高評価数
  viewer: number // metaで取得した視聴者数
  peakUpVote: number // 過去最高の高評価数
  peakViewer: number // 最大視聴者数
  follower: number // 登録者・サブスクライブ(Youtubeの場合は上3桁)


export const MetaTriggerSchema = z.object({
  conditions: z.array(MetaTriggerConditionSchema).catch([]),

  upVote: MetaConditionSchema.optional(),
  viewer: MetaConditionSchema.optional(),
  follower: z.any().optional(),
  startTime: z.any().optional(),
})

  

 */
