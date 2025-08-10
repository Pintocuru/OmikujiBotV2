// src/types/OmikujiDataSchema.ts
import { z } from 'zod';
import { DisplaySettingsSchema } from './DisplaySettingsSchema';
import { gameScriptMap } from '@/ConfigMaker/components/GameScripts/GameScriptsMap';
import { createScriptSettingsSchema } from '../GameScript/GameScriptSettingsSchema';
import { PlaceholderSchema } from './PlaceholderSchema';
import { CharacterSchema } from './CharacterSchema';
import { BaseCommentRuleSchema, BaseTimerRuleSchema, WordPartySettingsSchema } from './RulesSchema';
import { ensureUniqueIds, RecordCategoryItem, normalizeOrders } from './OmikujiDataNormalize';
import { PackageMetaSchema } from '@shared/types';

// 再エクスポート
export * from './CategoryType';
export * from './RulesSchema';
export * from './CategoryType';

// 基本スキーマ
export const CommentRuleSchema = BaseCommentRuleSchema;
export const TimerRuleSchema = BaseTimerRuleSchema;

// 正規化機能付きRecordスキーマ
export const CommentRuleRecordSchema = createRecordWithNormalization(CommentRuleSchema);
export const TimerRuleRecordSchema = createRecordWithNormalization(TimerRuleSchema);
export const PlaceholderRecordSchema = createRecordWithNormalization(PlaceholderSchema);
export const CharacterRecordSchema = createRecordWithNormalization(CharacterSchema);

// scriptSettings用
const scriptSettingsSchema = createScriptSettingsSchema(gameScriptMap);

/**
 * おみくじデータ全体のメインスキーマ
 */
export const OmikujiDataSchema = z.object({
 meta: PackageMetaSchema.catch(PackageMetaSchema.parse({})),
 comments: CommentRuleRecordSchema,
 timers: TimerRuleRecordSchema,
 placeholders: PlaceholderRecordSchema,
 characters: CharacterRecordSchema,
 scriptSettings: scriptSettingsSchema.catch({}),
 displaySettings: DisplaySettingsSchema.catch(DisplaySettingsSchema.parse({})),
 wordPartySettings: z.array(WordPartySettingsSchema).catch([])
});

// 型定義
export type OmikujiDataType = z.infer<typeof OmikujiDataSchema>;
export type CommentRuleType = z.infer<typeof CommentRuleSchema>;
export type TimerRuleType = z.infer<typeof TimerRuleSchema>;
export type RuleType = CommentRuleType | TimerRuleType;
export type DisplaySettingsType = z.infer<typeof DisplaySettingsSchema>;
export type ScriptSettings = z.infer<typeof scriptSettingsSchema>;

// カテゴリ更新用のスキーママップ
export const categorySchemaMap = {
 meta: PackageMetaSchema,
 comments: BaseCommentRuleSchema,
 timers: BaseTimerRuleSchema,
 placeholders: PlaceholderSchema,
 characters: CharacterSchema,
 wordPartySettings: z.array(WordPartySettingsSchema),
 scriptSettings: createScriptSettingsSchema(gameScriptMap),
 displaySettings: DisplaySettingsSchema
} as const;

/**
 * 生データを解析して正規化されたおみくじデータを返す
 */
export const parseAndNormalizeOmikujiData = (rawData: unknown): OmikujiDataType => {
 try {
  return OmikujiDataSchema.parse(rawData);
 } catch (error) {
  console.error('OmikujiData parse error:', error);
  return OmikujiDataSchema.parse({});
 }
};

/**
 * 既存データに外部データをマージする
 */
export const mergeExternalData = (
 existingData: OmikujiDataType,
 externalData: unknown
): OmikujiDataType => {
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

/**
 * 指定カテゴリのデータを更新する
 */
export const updateCategoryData = <K extends keyof OmikujiDataType>(
 existingData: OmikujiDataType,
 category: K,
 newData: unknown
): OmikujiDataType => {
 try {
  const schema = categorySchemaMap[category];
  if (!schema) throw new Error(`未知のカテゴリ: ${String(category)}`);

  const updatedData = {
   ...existingData,
   [category]: schema.parse(newData)
  };

  return OmikujiDataSchema.parse(updatedData);
 } catch (error) {
  console.error(`Category ${String(category)} update error:`, error);
  throw new Error(`${String(category)}データの更新に失敗しました`);
 }
};

// データの整合性をバリデーションする
export const validateDataIntegrity = (data: OmikujiDataType) => {
 const issues: string[] = [];
 // 必要に応じて追加の整合性チェックを実装
 return { isValid: issues.length === 0, issues };
};

// Record作成用のヘルパー関数
function createRecordWithNormalization<T extends z.ZodType<RecordCategoryItem>>(itemSchema: T) {
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
}
