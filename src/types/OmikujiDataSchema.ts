// src/types/OmikujiDataSchema.ts
// 250722_1 OmikujiLimits の新規作成
import { z } from 'zod';
import { BaseSchema } from '@shared/types/';
import {
 CommentThresholdSchema,
 countUnitCondition,
 countUnitConditionLabels,
 serviceMetaCondition,
 serviceMetaConditionLabels
} from '@shared/types/';
import { DisplaySettingsSchema } from './DisplaySettingsSchema';
import { scriptGameMap } from '@/ScriptGame/ScriptGameMap';
import { MessageCircle, Timer, Hash, Settings, Users, Monitor, ListChecks } from 'lucide-vue-next';
import { OmikujiSetSchema, PostActionSchema } from './OmikujiBot/OmikujiSchema';
import { createScriptSettingsSchema } from './GameScript/GameScriptSettingsSchema';
import { PlaceholderSchema } from './OmikujiBot/PlaceholderSchema';
import { CharacterSchema } from './OmikujiBot/CharacterSchema';

// defaultのプレースホルダー(user/Commentのmeta/ServiceMeta)
export const defaultPlaceholders = [
 'user',
 'price',
 ...countUnitCondition,
 ...serviceMetaCondition
] as const;
export type DefaultPlaceholders = (typeof defaultPlaceholders)[number];

export const defaultPlaceholdersLabels: Record<DefaultPlaceholders, string> = {
 user: 'コメントしたユーザー',
 price: 'ギフト金額',
 ...countUnitConditionLabels,
 ...serviceMetaConditionLabels
};

// OmikujiLimits
export const OmikujiLimitsSchema = z.object({
 processCooldownSeconds: z.number().min(0).max(300).catch(3), // 処理クールダウン時間、0で無効
 drawLimit: z.number().default(0).catch(0), // 今回のおみくじはこの回数以下か
 isRepeatAllowed: z.boolean().default(true).catch(true), // 連投を許可するか
 limitOverPost: z.optional(PostActionSchema).catch(PostActionSchema.parse({})) // 上記の制限で引っかかった場合の投稿
});

// Rule
const BaseRuleCommonSchema = z.object({
 ...BaseSchema.shape,
 isEnabled: z.boolean().default(true).catch(true),
 editorColor: z
  .string()
  .regex(/^#[0-9A-Fa-f]{6}$/)
  .default('#3B82F6')
  .catch('#3B82F6'),
 omikuji: z.array(OmikujiSetSchema).default([]).catch([])
});

// CommentRule
export const CommentRuleSchema = z.object({
 ...BaseRuleCommonSchema.shape,
 ruleType: z.literal('comments').default('comments').catch('comments'),
 threshold: CommentThresholdSchema.catch(CommentThresholdSchema.parse({})),
 scriptId: z.union([z.string(), z.null()]).default(null).catch(null),
 scriptParams: z.record(z.string(), z.any()).nullable().default(null).catch(null),
 limits: OmikujiLimitsSchema.catch(OmikujiLimitsSchema.parse({}))
});

// TimerRule
export const TimerRuleSchema = z.object({
 ...BaseRuleCommonSchema.shape,
 ruleType: z.literal('timers').default('timers').catch('timers'),
 intervalSeconds: z
  .number()
  .min(5)
  .max(60 * 60)
  .default(60 * 5)
  .catch(60 * 5),
 isBaseZero: z.boolean().default(false).catch(false)
});

// WordParty設定
export const WordPartySettingsSchema = z.object({
 name: z.string().default('').catch(''),
 pattern: z.string().default('').catch('')
});

// CategoryType categoryLabels
export const selectCategoryType = ['comments', 'timers', 'placeholders', 'characters'] as const;
export type SelectCategoryType = (typeof selectCategoryType)[number];

export const categoryType = [
 ...selectCategoryType,
 'scriptSettings',
 'displaySettings',
 'wordPartySettings'
] as const;
export type CategoryType = (typeof categoryType)[number];

export const categoryLabels: Record<
 CategoryType,
 { label: string; description: string; icon: any }
> = {
 comments: {
  label: 'コメントルール',
  description: 'チャットの内容やユーザー情報でおみくじを発火します',
  icon: MessageCircle
 },
 timers: {
  label: 'タイマールール',
  description: '時間経過で自動的におみくじを発火します',
  icon: Timer
 },
 placeholders: {
  label: 'プレースホルダー',
  description: 'コメント・タイマーで補助的に使用する、高性能なプレースホルダー',
  icon: Hash
 },
 characters: {
  label: 'キャラクター',
  description: 'BOTメッセージで使用するキャラクターアイコンや、カラーを設定します',
  icon: Users
 },
 scriptSettings: {
  label: 'ゲームスクリプト',
  description: 'ゲームスクリプトを動かし、特殊なプレースホルダーを生成するための初期設定',
  icon: Settings
 },
 displaySettings: {
  label: '表示設定',
  description: 'BOTメッセージやランキングの表示・非表示を設定します',
  icon: Monitor
 },
 wordPartySettings: {
  label: 'WordPartyリスト',
  description: 'コメント・タイマーの設定時に補助的に使える、WordPartyリスト。',
  icon: ListChecks
 }
};

// メインデータ構造のスキーマ
export const OmikujiDataSchema = z.object({
 comments: z.record(z.string(), CommentRuleSchema).default({}).catch({}),
 timers: z.record(z.string(), TimerRuleSchema).default({}).catch({}),
 placeholders: z.record(z.string(), PlaceholderSchema).default({}).catch({}),
 scriptSettings: createScriptSettingsSchema(scriptGameMap).default({}).catch({}),
 characters: z.record(z.string(), CharacterSchema).default({}).catch({}),
 displaySettings: DisplaySettingsSchema.catch(DisplaySettingsSchema.parse({})),
 wordPartySettings: z.array(WordPartySettingsSchema).default([]).catch([])
});

// 型エクスポート
export type OmikujiDataType = z.infer<typeof OmikujiDataSchema>;
export type CommentRuleType = z.infer<typeof CommentRuleSchema>;
export type TimerRuleType = z.infer<typeof TimerRuleSchema>;
export type RuleType = CommentRuleType | TimerRuleType;
export type OmikujiLimitsType = z.infer<typeof OmikujiLimitsSchema>;
export type DisplaySettingsType = z.infer<typeof DisplaySettingsSchema>;
export type WordPartySettings = z.infer<typeof WordPartySettingsSchema>;
