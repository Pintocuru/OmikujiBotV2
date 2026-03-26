// src/types/OmikujiData/CharacterSchema.ts
import { z } from 'zod'
import { PresetMetadataSchema } from '@shared/types'
import { DaisyUiThemeFieldsSchema } from '@shared/styles/DaisyUiTheme'
import { rpgVoiceKeys } from './SoundKey'
import { characterEmotionMap, displayModeMap } from '../MetaMaps'
import { normalizedObject } from './ParsedDefault'

/**
 * CharacterEmotion 感情ラベル
 */
export const characterEmotionKeys = Object.keys(characterEmotionMap) as CharacterEmotionType[]
export const CharacterEmotionSchema = z.enum(characterEmotionKeys)
export type CharacterEmotionType = keyof typeof characterEmotionMap

/**
 * CharacterColorSchema
 */
export const CharacterColorScheme = z.object({
  isTheme: z.boolean().default(true).catch(true), // DaisyUI テーマを使うかどうか
  ...DaisyUiThemeFieldsSchema.shape,
  nameColor: z.string().default('#212121').catch('#212121'),
  textColor: z.string().default('#212121').catch('#212121'),
  backgroundColor: z.string().default('#FAFAFA').catch('#FAFAFA'),
  // TODO(v3): customClasses を廃止
  customClasses: z
    .string()
    .optional()
    .describe('吹き出しに適用するカスタムTailwindクラス（例: "border-2 border-white shadow-lg"）'),
})
export type CharacterColorType = z.infer<typeof CharacterColorScheme>

/**
 * 画像セット
 */
const LayerSchema = z.array(z.string()).catch([])
export const CharacterImageSetSchema = z.object(
  Object.fromEntries(Object.keys(characterEmotionMap).map((key) => [key, LayerSchema])) as Record<
    CharacterEmotionType,
    typeof LayerSchema
  >
)
export type CharacterImageType = z.infer<typeof CharacterImageSetSchema>

/**
 * displayModes
 */
export const displayModes = Object.keys(displayModeMap) as DisplayModeType[]
export type DisplayModeType = keyof typeof displayModeMap

/**
 * DisplayOptionSchema
 */
export const DisplayOptionSchema = z.object({
  mode: z.enum(displayModes).default('comment'),
  imageBase64: z.string().default('').catch(''), // 表示時のアイコン
  frameId: z.string().default('').catch(''), // わんコメの枠指定
  rpgVoice: z.enum(rpgVoiceKeys).default('rpg_voice_a5').catch('rpg_voice_a5'), // RPG音声モード
})
export type DisplayOptionType = z.infer<typeof DisplayOptionSchema>

/**
 * CharacterSchema
 */
export const CharacterSchema = z.object({
  ...PresetMetadataSchema.shape,
  displayName: z.string().default('').catch(''),
  image: normalizedObject(CharacterImageSetSchema),
  color: normalizedObject(CharacterColorScheme),
  displayOption: normalizedObject(DisplayOptionSchema),
})

export type CharacterType = z.infer<typeof CharacterSchema>
