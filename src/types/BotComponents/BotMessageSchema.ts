// src\types\BotComponents\BotMessageSchema.ts
import { z } from 'zod'
import { CharacterColorScheme, CharacterEmotionSchema } from '../OmikujiData/CharacterSchema'
import { PostActionMessageBodySchema } from '../OmikujiData/OmikujiSchema'
import { motionLabel } from '@/MainGenerator/scripts/MotionVariants/MotionVariants'

// BotMessage : Commentを大幅に略したもの
export const BotMessageSchema = z.object({
  id: z.string().default(() => `${Date.now()}-${Math.random().toString(36).slice(2)}`), // ID
  timestamp: z.string().default(() => new Date().toISOString()), // 投稿日時
  delaySeconds: z.number().default(0), // 投稿までの遅延時間（秒）

  name: z.string().default('error'), // 名前
  comment: PostActionMessageBodySchema, // コメント
  characterKey: z.string().default(''), // キャラクターキー
  iconKey: CharacterEmotionSchema.default('default'), // アイコンキー(必要かどうかはわからん…)
  enterMotion: z.enum(motionLabel).optional(), // 入場アニメーション
  displaySeconds: z.number().min(0).max(60).optional(), // 表示時間（秒）0-60秒の範囲
  sound: z.string().optional(), // サウンド
  profileImage: z
    .union([z.string(), z.array(z.string())])
    .nullable()
    .catch(null), // アイコン、コンポーネント側で処理させる
  color: CharacterColorScheme.catch(CharacterColorScheme.parse({})), // カラー
})
export type BotMessage = z.infer<typeof BotMessageSchema>
