// shared/types/CharacterSchema.ts
import { z } from 'zod'
import { PresetMetadataSchema } from '@shared/types'

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
  'sleepy', // 眠い
] as const
export type CharacterEmotionType = (typeof characterEmotions)[number]
export const CharacterEmotionSchema = z.enum(characterEmotions)

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
  singing: '誇らしげ',
  sleepy: '退屈',
  wink: 'おふざけ',
}

// カラー
export const CharacterColorScheme = z.object({
  nameColor: z.string().default('#212121').catch('#212121'),
  textColor: z.string().default('#212121').catch('#212121'),
  backgroundColor: z.string().default('#FAFAFA').catch('#FAFAFA'),
  customClasses: z
    .string()
    .optional()
    .describe(
      '吹き出しに適用するカスタムTailwindクラス（例: "bg-gradient-to-r from-blue-500 to-purple-600 border-2 border-white shadow-lg"）'
    ),
})
export type CharacterColorType = z.infer<typeof CharacterColorScheme>

// 画像セットのスキーマ
export const CharacterImageSetSchema = z.object({
  default: z.string().optional(),
  happy: z.string().optional(),
  excited: z.string().optional(),
  laughing: z.string().optional(),
  blushing: z.string().optional(),
  surprised: z.string().optional(),
  sad: z.string().optional(),
  angry: z.string().optional(),
  thinking: z.string().optional(),
  wink: z.string().optional(),
  singing: z.string().optional(),
  sleepy: z.string().optional(),
})
export type CharacterImageType = z.infer<typeof CharacterImageSetSchema>

export const DisplayOptionSchema = z.object({
  isIconDisplay: z.boolean().default(true).catch(true),
  isOneCommePost: z.boolean().default(true).catch(true),
  isVoice: z.boolean().default(true).catch(true),
})
export type DisplayOptionType = z.infer<typeof DisplayOptionSchema>

/**
 * CharacterSchema
 */
export const CharacterSchema = z.object({
  ...PresetMetadataSchema.shape,
  displayName: z.string().default('').catch(''),
  frameId: z.string().optional().catch(undefined),
  displayOption: DisplayOptionSchema.catch(DisplayOptionSchema.parse({})),
  color: CharacterColorScheme.catch(CharacterColorScheme.parse({})),
  image: CharacterImageSetSchema.optional().catch(CharacterImageSetSchema.parse({})),
  imageBase64: z.string().optional().catch(undefined), // わんコメのジェネレーター用Base64画像
})
export type CharacterType = z.infer<typeof CharacterSchema>
