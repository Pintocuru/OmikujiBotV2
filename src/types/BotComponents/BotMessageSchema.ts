// src\types\BotComponents\BotMessageSchema.ts
import { z } from 'zod'
import { CharacterColorScheme, CharacterEmotionSchema } from '../OmikujiData/CharacterSchema'
import { motionLabel } from '@/MainGenerator/scripts/MotionVariants/MotionVariants'

// BotMessage : Commentを大幅に略したもの
export const BotMessageSchema = z.object({
  id: z.string().default(() => `${Date.now()}-${Math.random().toString(36).slice(2)}`), // ID
  timestamp: z.string().default(() => new Date().toISOString()), // 投稿日時
  delaySeconds: z.number().default(0), // 投稿までの遅延時間（秒）

  // botMessage用なので renderProps に入れる
  name: z.string().catch('error'), // 名前
  comment: z.string().catch('error'), // コメント
  characterKey: z.string().catch(''), // キャラクターキー
  iconKey: CharacterEmotionSchema.default('default').catch('default'), // アイコンキー(必要かどうかはわからん…)
  enterMotion: z.enum(motionLabel).optional(), // 入場アニメーション
  displaySeconds: z.number().min(0).max(60).optional().catch(undefined), // 表示時間（秒）0-60秒の範囲

  // 不要
  sound: z.string().optional(), // サウンド
  isToast: z.boolean().catch(false), // 通常表示かトースト表示か
  profileImage: z
    .union([z.string(), z.array(z.string())])
    .nullable()
    .catch(null), // アイコン、コンポーネント側で処理させる
  color: CharacterColorScheme.catch(CharacterColorScheme.parse({})), // カラー
})
export type BotMessage = z.infer<typeof BotMessageSchema>

/**


export const RenderSchema = z.object({
  id: z.string().default(() => `${Date.now()}-${Math.random().toString(36).slice(2)}`),
  timestamp: z.string().default(() => new Date().toISOString()),
  delaySeconds: z.number().default(0),
  renderType: z.string(), // 表示カテゴリ
  renderProps: z.record(z.any()).optional(), // コンポーネントに渡すprops
})

export type RenderType = z.infer<typeof RenderSchema>

*/
