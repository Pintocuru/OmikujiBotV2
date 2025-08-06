// shared/types/OmikujiBot/RulesSchema.ts
import { z } from 'zod';
import { BaseSchema, CommentThresholdSchema } from '@shared/types/';
import { PostActionSchema, OmikujiSetSchema } from './OmikujiSchema';

/**
 * おみくじ制限設定のスキーマ
 */
export const OmikujiLimitsSchema = z.object({
 /** 処理クールダウン時間（秒）、0で無効 */
 processCooldownSeconds: z.number().min(0).max(300).catch(3),
 /** 今回のおみくじはこの回数以下か */
 drawLimit: z.number().default(0).catch(0),
 /** 連投を許可するか */
 isRepeatAllowed: z.boolean().default(true).catch(true),
 /** 上記の制限で引っかかった場合の投稿 */
 limitOverPost: z.optional(PostActionSchema).catch(PostActionSchema.parse({}))
});

/**
 * WordParty設定のスキーマ
 */
export const WordPartySettingsSchema = z.object({
 /** WordPartyの名前 */
 name: z.string().default('').catch(''),
 /** WordPartyのパターン */
 pattern: z.string().default('').catch('')
});

/**
 * ルール共通部分の基本スキーマ
 */
export const BaseRuleCommonSchema = z.object({
 ...BaseSchema.shape,
 /** ルールが有効かどうか */
 isEnabled: z.boolean().default(true).catch(true),
 /** エディター表示用のカラーコード */
 editorColor: z
  .string()
  .regex(/^#[0-9A-Fa-f]{6}$/)
  .default('#3B82F6')
  .catch('#3B82F6'),
 /** おみくじセット配列 */
 omikuji: z.array(OmikujiSetSchema).default([]).catch([])
});

/**
 * コメントルールの基本スキーマ
 */
export const BaseCommentRuleSchema = z.object({
 ...BaseRuleCommonSchema.shape,
 /** ルールタイプ（コメント） */
 ruleType: z.literal('comments').default('comments').catch('comments'),
 /** コメント発火条件の閾値設定 */
 threshold: CommentThresholdSchema.catch(CommentThresholdSchema.parse({})),
 /** 関連するスクリプトID */
 scriptId: z.union([z.string(), z.null()]).default(null).catch(null),
 /** スクリプトパラメータ */
 scriptParams: z.record(z.string(), z.any()).nullable().default(null).catch(null),
 /** おみくじ実行制限設定 */
 limits: OmikujiLimitsSchema.catch(OmikujiLimitsSchema.parse({}))
});

/**
 * タイマールールの基本スキーマ
 */
export const BaseTimerRuleSchema = z.object({
 ...BaseRuleCommonSchema.shape,
 /** ルールタイプ（タイマー） */
 ruleType: z.literal('timers').default('timers').catch('timers'),
 /** 間隔時間（秒） */
 intervalSeconds: z
  .number()
  .min(5)
  .max(60 * 60)
  .default(60 * 5)
  .catch(60 * 5),
 /** ベースゼロ（開始時にすぐ実行するか） */
 isBaseZero: z.boolean().default(false).catch(false)
});

/**
 * おみくじ制限設定の型
 */
export type OmikujiLimitsType = z.infer<typeof OmikujiLimitsSchema>;

/**
 * WordParty設定の型
 */
export type WordPartySettings = z.infer<typeof WordPartySettingsSchema>;
