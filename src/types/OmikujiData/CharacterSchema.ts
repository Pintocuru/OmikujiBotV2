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
  default: 'デフォルト(default)',
  happy: '嬉しい(happy)',
  excited: 'ワクワク(excited)',
  laughing: '笑い(laughing)',
  blushing: '照れ(blushing)',
  surprised: '驚き(surprised)',
  sad: '悲しみ(sad)',
  angry: '怒り(angry)',
  thinking: '考え中(thinking)',
  singing: '誇らしげ(singing)',
  sleepy: '退屈(sleepy)',
  wink: 'おふざけ(wink)',
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

//
const LayerSchema = z
  .union([
    z.string(), // 単一画像（従来の互換性）
    z.array(z.string()), // レイヤー構成（順序で重ねる）
  ])
  .default('')
  .catch('')

// 画像セットのスキーマ
export const CharacterImageSetSchema = z.object({
  default: LayerSchema,
  happy: LayerSchema,
  excited: LayerSchema,
  laughing: LayerSchema,
  blushing: LayerSchema,
  surprised: LayerSchema,
  sad: LayerSchema,
  angry: LayerSchema,
  thinking: LayerSchema,
  wink: LayerSchema,
  singing: LayerSchema,
  sleepy: LayerSchema,
})
export type CharacterImageType = z.infer<typeof CharacterImageSetSchema>

export const DisplayOptionSchema = z.object({
  isIconDisplay: z.boolean().default(true).catch(true),
  isOneCommePost: z.boolean().default(true).catch(true),
  isVoice: z.boolean().default(true).catch(true),
  rpgVoice: z.string().default('').catch(''),
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
  image: CharacterImageSetSchema.catch(CharacterImageSetSchema.parse({})),
  imageBase64: z.string().optional().catch(undefined), // わんコメのジェネレーター用Base64画像
})
export type CharacterType = z.infer<typeof CharacterSchema>
