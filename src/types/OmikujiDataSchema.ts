// src/types/OmikujiDataSchema.ts
import { z } from 'zod';
import { DisplaySettingsSchema } from './DisplaySettingsSchema';
import { gameScriptMap } from '@/ConfigMaker/components/GameScripts/ScriptGameMap';
import { createScriptSettingsSchema } from './GameScript/GameScriptSettingsSchema';
import { PlaceholderSchema } from './OmikujiBot/PlaceholderSchema';
import { CharacterSchema } from './OmikujiBot/CharacterSchema';
import {
 BaseCommentRuleSchema,
 BaseTimerRuleSchema,
 WordPartySettingsSchema
} from './OmikujiBot/RulesSchema';
import { ensureUniqueIds, SelectCategoryItem, normalizeOrders } from './OmikujiDataNormalize';

// 再エクスポート
export * from './CategoryType';
export * from './OmikujiBot/RulesSchema';
export * from './CategoryType';

/**
 * 単一のコメントルールスキーマ
 */
export const CommentRuleSchema = BaseCommentRuleSchema;

/**
 * 単一のタイマールールスキーマ
 */
export const TimerRuleSchema = BaseTimerRuleSchema;

/**
 * 正規化機能付きコメントルールRecordスキーマ
 */
export const CommentRuleRecordSchema = createRecordWithNormalization(CommentRuleSchema);

/**
 * 正規化機能付きタイマールールRecordスキーマ
 */
export const TimerRuleRecordSchema = createRecordWithNormalization(TimerRuleSchema);

/**
 * 正規化機能付きプレースホルダーRecordスキーマ
 */
export const PlaceholderRecordSchema = createRecordWithNormalization(PlaceholderSchema);

/**
 * 正規化機能付きキャラクターRecordスキーマ
 */
export const CharacterRecordSchema = createRecordWithNormalization(CharacterSchema);

/**
 * おみくじデータ全体のメインスキーマ
 */
export const OmikujiDataSchema = z.object({
 /** コメントルール設定 */
 comments: CommentRuleRecordSchema,
 /** タイマールール設定 */
 timers: TimerRuleRecordSchema,
 /** プレースホルダー設定 */
 placeholders: PlaceholderRecordSchema,
 /** キャラクター設定 */
 characters: CharacterRecordSchema,
 /** ゲームスクリプト設定 */
 scriptSettings: createScriptSettingsSchema(gameScriptMap).default({}).catch({}),
 /** 表示設定 */
 displaySettings: DisplaySettingsSchema.catch(DisplaySettingsSchema.parse({})),
 /** WordPartyリスト */
 wordPartySettings: z.array(WordPartySettingsSchema).default([]).catch([])
});

/**
 * おみくじデータ全体の型
 */
export type OmikujiDataType = z.infer<typeof OmikujiDataSchema>;

/**
 * コメントルールの型
 */
export type CommentRuleType = z.infer<typeof CommentRuleSchema>;

/**
 * タイマールールの型
 */
export type TimerRuleType = z.infer<typeof TimerRuleSchema>;

/**
 * ルール全般の型
 */
export type RuleType = CommentRuleType | TimerRuleType;

/**
 * 表示設定の型
 */
export type DisplaySettingsType = z.infer<typeof DisplaySettingsSchema>;

/**
 * 生データを解析して正規化されたおみくじデータを返す
 * @param rawData - 解析対象の生データ
 * @returns 正規化されたおみくじデータ
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
 * @param existingData - 既存のおみくじデータ
 * @param externalData - マージする外部データ
 * @returns マージされた正規化済みデータ
 * @throws {Error} マージに失敗した場合
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
 * @param existingData - 既存のおみくじデータ
 * @param category - 更新対象のカテゴリ
 * @param newData - 新しいカテゴリデータ
 * @returns 更新された正規化済みデータ
 * @throws {Error} 更新に失敗した場合
 */
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

/**
 * データの整合性をバリデーションする
 * @param data - バリデーション対象のデータ
 * @returns バリデーション結果
 */
export const validateDataIntegrity = (data: OmikujiDataType) => {
 const issues: string[] = [];
 // 必要に応じて追加の整合性チェックを実装
 return { isValid: issues.length === 0, issues };
};

/**
 *
 */
function createRecordWithNormalization<T extends z.ZodType<SelectCategoryItem>>(itemSchema: T) {
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
