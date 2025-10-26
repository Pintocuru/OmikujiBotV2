// src\types\BotComponents\BotMessageSchema.ts
import { z } from 'zod'
import { CharacterColorScheme, CharacterEmotionSchema } from '../OmikujiData/CharacterSchema'
import { motionLabel } from '@/MainGenerator/scripts/MotionVariants/MotionVariants'

// BotMessage : Commentを大幅に略したもの
export const BotMessageSchema = z.object({
  id: z.string().default(() => `${Date.now()}-${Math.random().toString(36).slice(2)}`), // ID
  name: z.string().catch('error'), // 名前
  characterKey: z.string().catch(''), // キャラクターキー
  iconKey: CharacterEmotionSchema.default('default').catch('default'), // アイコンキー(必要かどうかはわからん…)
  profileImage: z
    .union([z.string(), z.array(z.string())])
    .nullable()
    .catch(null), // アイコン
  enterMotion: z.enum(motionLabel).optional(), // 入場アニメーション
  sound: z.string().optional().catch(''), // サウンド
  timestamp: z.string().default(() => new Date().toISOString()), // 投稿日時
  comment: z.string().catch('error'), // コメント
  isToast: z.boolean().catch(false), // 通常表示かトースト表示か
  color: CharacterColorScheme.catch(CharacterColorScheme.parse({})), // カラー
  delaySeconds: z.number().default(0), // 投稿までの遅延時間（秒）
  displaySeconds: z.number().min(0).max(60).optional().catch(undefined), // 表示時間（秒）0-60秒の範囲
})
export type BotMessage = z.infer<typeof BotMessageSchema>
