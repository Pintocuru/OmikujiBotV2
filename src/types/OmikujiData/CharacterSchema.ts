// src\types\OmikujiData\CharacterSchema.ts
import { z } from 'zod'
import { PresetMetadataSchema } from '@shared/types'
import { DaisyUiThemeFieldsSchema } from '@shared/styles/DaisyUiTheme'
import { rpgVoiceKeys } from './SoundKey'

// 感情ラベルマップ
export const emotionLabels = {
  default: 'デフォルト(default)',
  happy: '嬉しい(happy)',
  excited: 'ワクワク(excited)',
  laughing: '笑い(laughing)',
  blushing: '照れ(blushing)',
  surprised: '驚き(surprised)',
  sad: '悲しみ(sad)',
  angry: '怒り(angry)',
  thinking: '考え中(thinking)',
  wink: 'おふざけ(wink)',
  singing: '誇らしげ(singing)',
  sleepy: '退屈(sleepy)',
} as const

export const characterEmotionKeys = Object.keys(emotionLabels) as CharacterEmotionType[]
export type CharacterEmotionType = keyof typeof emotionLabels
export const CharacterEmotionSchema = z.enum(
  Object.keys(emotionLabels) as [CharacterEmotionType, ...CharacterEmotionType[]]
)

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

// 画像セットのスキーマ
const LayerSchema = z.array(z.string()).catch([])
export const CharacterImageSetSchema = z.object(
  Object.fromEntries(Object.keys(emotionLabels).map((key) => [key, LayerSchema])) as Record<
    CharacterEmotionType,
    typeof LayerSchema
  >
)
export type CharacterImageType = z.infer<typeof CharacterImageSetSchema>

/**
 * DisplayOptionSchema
 */
export const displayModes = ['comment', 'voice', 'rpgVoice', 'none'] as const
export type DisplayModeType = (typeof displayModes)[number]

export const displayModeLabels: Record<DisplayModeType, string> = {
  comment: 'わんコメでの表示+読み上げ',
  voice: '読み上げのみ',
  rpgVoice: 'RPG風音声',
  none: 'なし',
}

export const DisplayOptionSchema = z.object({
  mode: z.enum(displayModes).default('comment'),
  imageBase64: z.string().default('').catch(''), // 表示時のアイコン
  frameId: z.string().default('').catch(''), // わんコメの枠指定
  // RPG音声モード
  rpgVoice: z
    .union([z.enum(rpgVoiceKeys), z.literal('')])
    .default('')
    .catch(''),
})
export type DisplayOptionType = z.infer<typeof DisplayOptionSchema>

/**
 * CharacterSchema
 */
export const CharacterSchema = z.object({
  ...PresetMetadataSchema.shape,
  displayName: z.string().default('').catch(''),
  image: CharacterImageSetSchema.catch(CharacterImageSetSchema.parse({})),
  color: CharacterColorScheme.catch(CharacterColorScheme.parse({})),
  displayOption: DisplayOptionSchema.catch(DisplayOptionSchema.parse({})),
})

export type CharacterType = z.infer<typeof CharacterSchema>
