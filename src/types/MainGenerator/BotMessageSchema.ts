// src\types\MainGenerator\BotMessageSchema.ts
import { z } from 'zod'
import { CharacterColorScheme, CharacterEmotionSchema } from '../OmikujiData/CharacterSchema'
import { PostActionMessageBodySchema } from '../OmikujiData/PostActionMessage'

// BotMessage : Commentを大幅に略したもの
export const BotMessageSchema = z.object({
  id: z.string().default(() => `${Date.now()}-${Math.random().toString(36).slice(2)}`), // ID
  timestamp: z.string().default(() => new Date().toISOString()), // 投稿日時
  delaySeconds: z.number().default(0), // 投稿までの遅延時間（秒）

  name: z.string().default('error'), // 名前
  message: PostActionMessageBodySchema, // コメント
  characterKey: z.string().default(''), // キャラクターキー
  iconKey: CharacterEmotionSchema.default('default'), // アイコンキー(必要かどうかはわからん…)
  displaySeconds: z.number().min(0).max(60).optional(), // 表示時間（秒）0-60秒の範囲
  sound: z.string().default(''), // サウンド
  iconLayers: z.array(z.string()).nullable().default(null).catch(null),
  color: CharacterColorScheme.catch(CharacterColorScheme.parse({})), // カラー
})
export type BotMessage = z.infer<typeof BotMessageSchema>
