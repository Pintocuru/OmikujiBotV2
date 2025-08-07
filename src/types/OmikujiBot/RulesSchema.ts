// shared/types/OmikujiBot/RulesSchema.ts
import { z } from 'zod';
import { BaseSchema, CommentThresholdSchema } from '@shared/types/';
import { PostActionSchema, OmikujiSetSchema } from './OmikujiSchema';

// おみくじ制限設定のスキーマ
export const OmikujiLimitsSchema = z.object({
 processCooldownSeconds: z.number().min(0).max(300).catch(3), // 処理クールダウン時間（秒）、0で無効
 drawLimit: z.number().default(0).catch(0), // 今回のおみくじはこの回数以下か
 isRepeatAllowed: z.boolean().default(true).catch(true), // 連投を許可するか
 // 上記の制限で引っかかった場合の投稿
 limitOverPost: z.optional(PostActionSchema).catch(PostActionSchema.parse({}))
});

// WordParty設定のスキーマ
export const WordPartySettingsSchema = z.object({
 name: z.string().default('').catch(''), // WordPartyの名前
 pattern: z.string().default('').catch('') // WordPartyのパターン
});

// ルール共通部分の基本スキーマ
export const BaseRuleCommonSchema = z.object({
 ...BaseSchema.shape,
 isEnabled: z.boolean().default(true).catch(true), // ルールが有効かどうか
 // エディター表示用のカラーコード
 editorColor: z
  .string()
  .regex(/^#[0-9A-Fa-f]{6}$/)
  .default('#3B82F6')
  .catch('#3B82F6'),
 // おみくじセット配列
 omikuji: z.array(OmikujiSetSchema).default([]).catch([])
});

// コメントルールの基本スキーマ
export const BaseCommentRuleSchema = z.object({
 ...BaseRuleCommonSchema.shape,
 ruleType: z.literal('comments').default('comments').catch('comments'), // ルールタイプ（コメント）
 threshold: CommentThresholdSchema.catch(CommentThresholdSchema.parse({})), // コメント発火条件
 scriptId: z.union([z.string(), z.null()]).default(null).catch(null), // 関連するスクリプトID
 scriptParams: z.record(z.string(), z.any()).nullable().default(null).catch(null), // スクリプトパラメータ
 limits: OmikujiLimitsSchema.catch(OmikujiLimitsSchema.parse({})) // おみくじ実行制限設定
});

// タイマールールの基本スキーマ
export const BaseTimerRuleSchema = z.object({
 ...BaseRuleCommonSchema.shape,
 ruleType: z.literal('timers').default('timers').catch('timers'), // ルールタイプ（タイマー）
 // 間隔時間（秒）
 intervalSeconds: z
  .number()
  .min(5)
  .max(60 * 60)
  .default(60 * 5)
  .catch(60 * 5),
 isBaseZero: z.boolean().default(false).catch(false) // 0時0分を基準にするか
});

/**
 * 型
 */
export type OmikujiLimitsType = z.infer<typeof OmikujiLimitsSchema>;
export type WordPartySettings = z.infer<typeof WordPartySettingsSchema>;
