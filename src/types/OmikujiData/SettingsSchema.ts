// src/types/OmikujiData/SettingsSchema.ts
import { z } from 'zod'
import { categoryTypeLabel } from './CategoryType'
import { themes } from '@shared/styles/DaisyUiTheme'

// コメント購読タイプ(現在はわんコメのみ)
export const commentModeTypes = ['OneComme'] as const
export type CommentModeType = (typeof commentModeTypes)[number]

// 言語設定(現在は日本語のみ)
export const locales = ['ja', 'en', 'zh-TW', 'zh-CN', 'th', 'ko'] as const
export type LocaleType = (typeof locales)[number]

/**
 * エディター設定
 */
export const SettingsSchema = z.object({
  // TODO(v3): generator にネスト
  commentType: z.enum(commentModeTypes).default('OneComme').catch('OneComme'), // コメント購読タイプ
  soundEnabled: z.boolean().default(true).catch(true), // サウンドを有効にするか
  ignoreUserPattern: z.string().default('__INFO__|__ERROR__').catch('__INFO__|__ERROR__'), // VisitUserを無視するリスト
  includeExternalComments: z.boolean().default(false).catch(false), // 外部コメントをユーザーリストに入れるか
  uiPlacement: z.enum(['center', 'embedded']).default('center').catch('center'), // 単体のアイテムを中央に配置するか
  basicDelaySeconds: z.number().min(0).max(5).default(1).catch(1), // 投稿の基本的な遅延時間（秒）

  // TODO(v3): editor にネスト
  locale: z.enum(locales).default('ja').catch('ja'), // 言語設定
  licenseKeyHash: z.string().default('').catch(''), // ライセンスキー
  daisyUiTheme: z.enum(themes).default('dark').catch('dark'), // エディターのテーマカラー
  initialCategory: z.enum(categoryTypeLabel).default('comments').catch('comments'), // 読み込み時に開くカテゴリ
})

export type SettingsType = z.infer<typeof SettingsSchema>
