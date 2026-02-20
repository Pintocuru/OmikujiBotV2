// src/common/migrations/v1_to_v2/OmikujiDataV200/SettingsSchema.ts
import { z } from 'zod'
import { themes } from '@shared/styles/DaisyUiTheme'

// コメント購読タイプ(現在はわんコメのみ)
export const commentTypes = ['OneComme'] as const
export type CommentType = (typeof commentTypes)[number]

/**
 * エディター設定
 */
export const SettingsSchema = z.object({
  commentType: z.enum(commentTypes).default('OneComme'),
  licenseKeyHash: z.string().default('').catch(''),
  daisyUiTheme: z.enum(themes).default('dark'),
})

export type SettingsType = z.infer<typeof SettingsSchema>
