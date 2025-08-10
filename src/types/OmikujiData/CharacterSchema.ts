// shared/types/CharacterSchema.ts
// 250714_1　全編改変
import { z } from 'zod';
import { PresetMetadataSchema } from '@shared/types';

/**
 * 各種 Threshold
 */

/** キャラクターの画像設定 */
export const characterEmotions = [
 'default', // 基本
 'happy', // 喜び
 'excited', // ワクワク
 'laughing', // 笑い
 'blushing', // 照れ
 'surprised', // 驚き
 'sad', // 悲しみ
 'angry', // 怒り
 'thinking', // 考え中
 'wink', // 茶目っ気
 'singing', // 歌
 'sleepy' // 眠い
] as const;
export type CharacterEmotionType = (typeof characterEmotions)[number];
export const CharacterEmotionSchema = z.enum(characterEmotions);

// 感情ラベルマップ
export const emotionLabels: Record<CharacterEmotionType, string> = {
 default: 'デフォルト',
 happy: '嬉しい',
 excited: 'ワクワク',
 laughing: '笑い',
 blushing: '照れ',
 surprised: '驚き',
 sad: '悲しみ',
 angry: '怒り',
 thinking: '考え中',
 wink: '茶目っ気',
 singing: '歌',
 sleepy: '眠い'
};

// TODO:カラープリセットを作成
export const CharacterColorScheme = z.object({
 nameColor: z.string().default('#212121').catch('#212121'),
 textColor: z.string().default('#212121').catch('#212121'),
 backgroundColor: z.string().default('#FAFAFA').catch('#FAFAFA')
});
export type CharacterColorType = z.infer<typeof CharacterColorScheme>;

export const CharacterImageSetSchema = z.object({
 default: z.string().default('').catch(''),
 happy: z.string().default('').catch(''),
 excited: z.string().default('').catch(''),
 laughing: z.string().default('').catch(''),
 blushing: z.string().default('').catch(''),
 surprised: z.string().default('').catch(''),
 sad: z.string().default('').catch(''),
 angry: z.string().default('').catch(''),
 thinking: z.string().default('').catch(''),
 wink: z.string().default('').catch(''),
 singing: z.string().default('').catch(''),
 sleepy: z.string().default('').catch('')
});
export type CharacterImageType = z.infer<typeof CharacterImageSetSchema>;

export const DisplayOptionSchema = z.object({
 isIconDisplay: z.boolean().default(true).catch(true),
 isOneCommePost: z.boolean().default(true).catch(true),
 isVoice: z.boolean().default(true).catch(true)
 // TODO:アニメーションの実装
});
export type DisplayOptionType = z.infer<typeof DisplayOptionSchema>;

/**
 * CharacterSchema
 */
export const CharacterSchema = z.object({
 ...PresetMetadataSchema.shape,
 displayName: z.string().default('').catch(''),
 frameId: z.string().default('').catch(''),
 displayOption: DisplayOptionSchema.catch(DisplayOptionSchema.parse({})),
 color: CharacterColorScheme.catch(CharacterColorScheme.parse({})),
 image: CharacterImageSetSchema.catch(CharacterImageSetSchema.parse({}))
});
export type CharacterType = z.infer<typeof CharacterSchema>;
