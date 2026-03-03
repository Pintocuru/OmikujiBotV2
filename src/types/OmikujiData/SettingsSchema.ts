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
  initialCategory: z.enum(categoryTypeLabel).default('comments').catch('comments'),
})

export type SettingsType = z.infer<typeof SettingsSchema>
