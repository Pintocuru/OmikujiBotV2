//
import { z } from 'zod'
import { CharacterColorScheme } from '../OmikujiData/CharacterSchema'

// BotMessage : Commentを大幅に略したもの
export const BotMessageSchema = z.object({
  id: z
    .number()
    .default(() => Date.now())
    .catch(() => Date.now()), // ID
  name: z.string().catch('error'), // 名前
  profileImage: z.string().nullable().catch(null), // アイコン
  timestamp: z
    .string()
    .default(() => new Date().toISOString())
    .catch(() => new Date().toISOString()), // 投稿日時
  comment: z.string().catch('error'), // コメント
  isToast: z.boolean().catch(false), // 通常表示かトースト表示か
  color: CharacterColorScheme.catch(CharacterColorScheme.parse({})), // カラー
  delaySeconds: z.number().default(0).catch(0), // 投稿までの遅延時間（秒）
  displaySeconds: z.number().min(0).max(60).optional().catch(undefined), // 表示時間（秒）0-60秒の範囲
})
export type BotMessage = z.infer<typeof BotMessageSchema>
