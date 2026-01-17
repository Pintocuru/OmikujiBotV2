// src\types\OmikujiData\CharacterSchema.ts
import { z } from 'zod'
import { PresetMetadataSchema } from '@shared/types'
import { DaisyUiThemeFieldsSchema } from '@shared/styles/DaisyUiTheme'

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

export const CharacterColorScheme = z.object({
  isTheme: z.boolean().default(false).catch(false), // DaisyUI テーマを使うかどうか
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

// v2から string → [string] に変更
const LayerSchema = z
  .union([z.string(), z.array(z.string())])
  .transform((value) => {
    if (typeof value === 'string') return value ? [value] : []
    if (Array.isArray(value)) return value
    return []
  })
  .catch([]) // パース失敗時も空配列に統一

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

/**
 * CharacterSchema
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
  rpgVoice: z.string().default('').catch(''), // RPG音声モード
})
export type DisplayOptionType = z.infer<typeof DisplayOptionSchema>

/**
 * CharacterSchema
 * ! マイグレーション済
 */
export const CharacterSchema = z
  .object({
    ...PresetMetadataSchema.shape,
    displayName: z.string().default('').catch(''),

    // 旧データ用（v1）
    frameId: z.string().optional().catch(undefined),
    imageBase64: z.string().optional().catch(undefined),

    // 旧 displayOption（v1）
    displayOption: z.any(),
    // displayOption: DisplayOptionSchema.catch(DisplayOptionSchema.parse({})),

    color: CharacterColorScheme.catch(CharacterColorScheme.parse({})),
    image: CharacterImageSetSchema.catch(CharacterImageSetSchema.parse({})),
  })
  .transform((old) => {
    const opt = old.displayOption || {}

    // すでに新形式（modeが存在する）の場合は、そのまま活かす
    if (opt.mode && displayModes.includes(opt.mode)) {
      return {
        ...old,
        displayOption: opt as DisplayOptionType,
        imageBase64: undefined,
        frameId: undefined,
      }
    }

    // --- 旧形式からの変換ロジック ---

    // 判定変数（undefined/null対策を徹底）
    const isOneComme = opt.isOneCommePost === true
    const isVoice = opt.isVoice === true
    const hasRpgVoice = !!(opt.rpgVoice || typeof opt.rpgVoice === 'string')

    let mode: DisplayModeType = 'comment'

    // 優先順位1: isOneCommePost が true なら無条件で comment (今回のケース)
    if (isOneComme) {
      mode = 'comment'
    }
    // 優先順位2: わんコメ投稿せず、ボイス設定がある場合
    else if (isVoice) {
      mode = 'voice'
    }
    // 優先順位3: RPG音声の設定がある場合
    else if (hasRpgVoice) {
      mode = 'rpgVoice'
    }
    // 優先順位4: どれも当てはまらない、または明示的にフラグが折れている場合
    else {
      mode = 'none'
    }

    // 新形式のオブジェクトを再構成
    const newDisplayOption: DisplayOptionType = {
      mode,
      // ルートにあった値、あるいは opt 内にあった値を統合
      imageBase64: old.imageBase64 || opt.imageBase64 || '',
      frameId: old.frameId || opt.frameId || '',
      rpgVoice: typeof opt.rpgVoice === 'string' ? opt.rpgVoice : '',
    }

    return {
      ...old,
      displayOption: newDisplayOption,
      imageBase64: undefined, // 旧データのクリーンアップ
      frameId: undefined,
    }
  })

export type CharacterType = z.infer<typeof CharacterSchema>
