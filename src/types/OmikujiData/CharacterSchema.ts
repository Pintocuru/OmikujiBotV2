// src/types/OmikujiData/CharacterSchema.ts
import { z } from 'zod'
import { PresetMetadataSchema } from '@shared/types'
import { DaisyUiThemeFieldsSchema } from '@shared/styles/DaisyUiTheme'
import { rpgVoiceKeys } from './SoundKey'
import { characterEmotionMap, displayModeMap } from '../MetaMaps'
import { normalizedObject } from './ParsedDefault'
import { loopMotionMap } from '../MetaMaps/loopMotionMaps'

/**
 * CharacterEmotion 感情ラベル
 */
export const characterEmotionKeys = Object.keys(characterEmotionMap) as CharacterEmotionType[]
export const CharacterEmotionSchema = z.enum(characterEmotionKeys)
export type CharacterEmotionType = keyof typeof characterEmotionMap

/**
 * CharacterColorSchema
 */
// TODO(v3): 廃止
export const CharacterColorScheme = z.object({
  isTheme: z.boolean().default(true).catch(true), // DaisyUI テーマを使うかどうか
  ...DaisyUiThemeFieldsSchema.shape,
  nameColor: z.string().default('#212121').catch('#212121'),
  textColor: z.string().default('#212121').catch('#212121'),
  backgroundColor: z.string().default('#FAFAFA').catch('#FAFAFA'),
  customClasses: z
    .string()
    .optional()
    .describe('吹き出しに適用するカスタムTailwindクラス（例: "border-2 border-white shadow-lg"）'),
})
export type CharacterColorType = z.infer<typeof CharacterColorScheme>

/**
 * アニメーション
 */
const loopMotion = Object.keys(loopMotionMap) as LoopMotionType[]
export type LoopMotionType = keyof typeof loopMotionMap

export const CharacterAnimationSchema = z.object({
  type: z.enum(loopMotion).default('none').catch('none'),
  duration: z.number().default(1.5).catch(1.5),
  loop: z.boolean().default(true).catch(true),
})
export type CharacterAnimationType = z.infer<typeof CharacterAnimationSchema>

/**
 * 画像セット
 */
const CharacterImageSchema = z.object({
  label: z.string().default(''),
  src: z.array(z.string()).catch([]),
  animation: CharacterAnimationSchema.optional(),
})

const LegacyOrNewImageSchema = z.union([
  z.array(z.string()), // 旧
  CharacterImageSchema, // 新
])

export const CharacterImageSetSchema = z.record(z.string(), LegacyOrNewImageSchema).transform((val) => {
  const result: Record<string, z.infer<typeof CharacterImageSchema>> = {}

  for (const key in val) {
    const v = val[key]

    // 旧 → 新へ変換
    if (Array.isArray(v)) {
      result[key] = {
        src: v,
        label: key in characterEmotionMap ? characterEmotionMap[key as keyof typeof characterEmotionMap] : key,
      }
    } else {
      result[key] = v
    }
  }

  return result
})
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
  // TODO(v3): BaseRecordSchema に変更
  ...PresetMetadataSchema.shape,
  displayName: z.string().default('').catch(''),
  image: normalizedObject(CharacterImageSetSchema),
  // TODO(v3): CharacterColorScheme ではなく DaisyUiThemeFieldsSchema を使う
  color: normalizedObject(CharacterColorScheme),
  displayOption: normalizedObject(DisplayOptionSchema),
})

export type CharacterType = z.infer<typeof CharacterSchema>
