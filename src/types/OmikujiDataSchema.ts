// src/types/OmikujiDataSchema.ts
// 修正版: 正規化機能を含むOmikujiDataSchema
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';
import { BaseSchema } from '@shared/types/';
import {
 CommentThresholdSchema,
 countUnitCondition,
 countUnitConditionLabels,
 serviceMetaCondition,
 serviceMetaConditionLabels
} from '@shared/types/';
import { DisplaySettingsSchema } from './DisplaySettingsSchema';
import { gameScriptMap } from '@/ConfigMaker/components/GameScripts/ScriptGameMap';
import { MessageCircle, Timer, Hash, Settings, Users, Monitor, ListChecks } from 'lucide-vue-next';
import { OmikujiSetSchema, PostActionSchema } from './OmikujiBot/OmikujiSchema';
import { createScriptSettingsSchema } from './GameScript/GameScriptSettingsSchema';
import { PlaceholderSchema } from './OmikujiBot/PlaceholderSchema';
import { CharacterSchema } from './OmikujiBot/CharacterSchema';

// ==========================
// 基本定義
// ==========================

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

export const OmikujiLimitsSchema = z.object({
 processCooldownSeconds: z.number().min(0).max(300).catch(3),
 drawLimit: z.number().default(0).catch(0),
 isRepeatAllowed: z.boolean().default(true).catch(true),
 limitOverPost: z.optional(PostActionSchema).catch(PostActionSchema.parse({}))
});

export const WordPartySettingsSchema = z.object({
 name: z.string().default('').catch(''),
 pattern: z.string().default('').catch('')
});

// ==========================
// 正規化ヘルパー関数
// ==========================

type NormalizableItem = { id: string; order: number; [key: string]: any };

const normalizeOrders = <T extends NormalizableItem>(items: T[]): T[] => {
 if (!Array.isArray(items) || items.length === 0) return items;

 const sortedItems = [...items].sort((a, b) => {
  if (a.order === b.order) return a.id.localeCompare(b.id);
  return a.order - b.order;
 });

 return sortedItems.map((item, index) => ({ ...item, order: index + 1 }));
};

const ensureUniqueIds = <T extends { id: string }>(items: T[]): T[] => {
 const newItems: T[] = [];
 const seenIds = new Set<string>();

 for (const item of items) {
  let newId = item.id;
  if (seenIds.has(newId)) newId = uuidv4();
  seenIds.add(newId);
  newItems.push(newId === item.id ? item : { ...item, id: newId });
 }
 return newItems;
};

const createRecordWithNormalization = <T extends z.ZodType<NormalizableItem>>(itemSchema: T) => {
 return z
  .record(z.string(), itemSchema)
  .default({})
  .catch({})
  .transform((record) => {
   if (!record || typeof record !== 'object') return {};

   const items: z.infer<T>[] = Object.values(record);
   const uniqueItems = ensureUniqueIds(items);
   const orderNormalizedItems = normalizeOrders(uniqueItems);

   const result: Record<string, z.infer<T>> = {};
   orderNormalizedItems.forEach((item) => {
    result[item.id] = item;
   });
   return result;
  });
};

// ==========================
// スキーマ定義
// ==========================

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

// 単一のルールスキーマ（元の形式を維持）
export const CommentRuleSchema = z.object({
 ...BaseRuleCommonSchema.shape,
 ruleType: z.literal('comments').default('comments').catch('comments'),
 threshold: CommentThresholdSchema.catch(CommentThresholdSchema.parse({})),
 scriptId: z.union([z.string(), z.null()]).default(null).catch(null),
 scriptParams: z.record(z.string(), z.any()).nullable().default(null).catch(null),
 limits: OmikujiLimitsSchema.catch(OmikujiLimitsSchema.parse({}))
});

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

// Record用の正規化機能付きスキーマ（別名で定義）
export const CommentRuleRecordSchema = createRecordWithNormalization(CommentRuleSchema);
export const TimerRuleRecordSchema = createRecordWithNormalization(TimerRuleSchema);
export const PlaceholderRecordSchema = createRecordWithNormalization(PlaceholderSchema);
export const CharacterRecordSchema = createRecordWithNormalization(CharacterSchema);

// ==========================
// カテゴリ定義
// ==========================

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

// ==========================
// メインスキーマ
// ==========================

export const OmikujiDataSchema = z
 .object({
  comments: CommentRuleRecordSchema, // 正規化機能付きRecord
  timers: TimerRuleRecordSchema, // 正規化機能付きRecord
  placeholders: PlaceholderRecordSchema,
  characters: CharacterRecordSchema,
  scriptSettings: createScriptSettingsSchema(gameScriptMap).default({}).catch({}),
  displaySettings: DisplaySettingsSchema.catch(DisplaySettingsSchema.parse({})),
  wordPartySettings: z.array(WordPartySettingsSchema).default([]).catch([])
 })
 .transform((data) => {
  console.log('データ正規化完了:', {
   comments: Object.keys(data.comments).length,
   timers: Object.keys(data.timers).length,
   placeholders: Object.keys(data.placeholders).length,
   characters: Object.keys(data.characters).length,
   wordPartySettings: data.wordPartySettings.length
  });
  return data;
 });

// ==========================
// 型エクスポート
// ==========================

export type OmikujiDataType = z.infer<typeof OmikujiDataSchema>;
export type CommentRuleType = z.infer<typeof CommentRuleSchema>;
export type TimerRuleType = z.infer<typeof TimerRuleSchema>;
export type RuleType = CommentRuleType | TimerRuleType;
export type OmikujiLimitsType = z.infer<typeof OmikujiLimitsSchema>;
export type DisplaySettingsType = z.infer<typeof DisplaySettingsSchema>;
export type WordPartySettings = z.infer<typeof WordPartySettingsSchema>;

// ==========================
// ユーティリティ関数
// ==========================

export const parseAndNormalizeOmikujiData = (rawData: unknown) => {
 try {
  return OmikujiDataSchema.parse(rawData);
 } catch (error) {
  console.error('OmikujiData parse error:', error);
  return OmikujiDataSchema.parse({});
 }
};

export const mergeExternalData = (existingData: OmikujiDataType, externalData: unknown) => {
 try {
  const parsedExternal = OmikujiDataSchema.parse(externalData);
  const merged = {
   comments: { ...existingData.comments, ...parsedExternal.comments },
   timers: { ...existingData.timers, ...parsedExternal.timers },
   placeholders: { ...existingData.placeholders, ...parsedExternal.placeholders },
   characters: { ...existingData.characters, ...parsedExternal.characters },
   scriptSettings: parsedExternal.scriptSettings,
   displaySettings: parsedExternal.displaySettings,
   wordPartySettings: parsedExternal.wordPartySettings
  };
  return OmikujiDataSchema.parse(merged);
 } catch (error) {
  console.error('External data merge error:', error);
  throw new Error('外部データのマージに失敗しました');
 }
};

export const updateCategoryData = <K extends keyof OmikujiDataType>(
 existingData: OmikujiDataType,
 category: K,
 newData: unknown
): OmikujiDataType => {
 try {
  const updatedData = { ...existingData } as OmikujiDataType;

  switch (category) {
   case 'comments':
    (updatedData as any).comments = CommentRuleRecordSchema.parse(newData);
    break;
   case 'timers':
    (updatedData as any).timers = TimerRuleRecordSchema.parse(newData);
    break;
   case 'placeholders':
    (updatedData as any).placeholders = PlaceholderRecordSchema.parse(newData);
    break;
   case 'characters':
    (updatedData as any).characters = CharacterRecordSchema.parse(newData);
    break;
   case 'wordPartySettings':
    (updatedData as any).wordPartySettings = z.array(WordPartySettingsSchema).parse(newData);
    break;
   case 'scriptSettings':
    (updatedData as any).scriptSettings = createScriptSettingsSchema(gameScriptMap).parse(newData);
    break;
   case 'displaySettings':
    (updatedData as any).displaySettings = DisplaySettingsSchema.parse(newData);
    break;
   default:
    throw new Error(`未知のカテゴリ: ${String(category)}`);
  }

  return OmikujiDataSchema.parse(updatedData);
 } catch (error) {
  console.error(`Category ${String(category)} update error:`, error);
  throw new Error(`${String(category)}データの更新に失敗しました`);
 }
};

export const validateDataIntegrity = (data: OmikujiDataType) => {
 const issues: string[] = [];
 // 必要に応じて追加の整合性チェックを実装
 return { isValid: issues.length === 0, issues };
};
