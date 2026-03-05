// src/types/OmikujiData/SettingsSchema.ts
import { z } from 'zod'
import { categoryTypeLabel } from './CategoryType'
import { themes } from '@shared/styles/DaisyUiTheme'

// コメント購読タイプ(現在はわんコメのみ)
export const commentModeTypes = ['OneComme'] as const
export type CommentModeType = (typeof commentModeTypes)[number]

/**
 * エディター設定
 */
export const SettingsSchema = z.object({
  commentType: z.enum(commentModeTypes).default('OneComme').catch('OneComme'),
  licenseKeyHash: z.string().default('').catch(''),
  daisyUiTheme: z.enum(themes).default('dark').catch('dark'),
  initialCategory: z.enum(categoryTypeLabel).default('comments').catch('comments'), // 読み込み時開くカテゴリ
  soundEnabled: z.boolean().default(true).catch(true), // サウンドを有効にするか
  ignoreUserPattern: z.string().default('__INFO__|__ERROR__').catch('__INFO__|__ERROR__'), // VisitUserを無視するリスト
})

export type SettingsType = z.infer<typeof SettingsSchema>
