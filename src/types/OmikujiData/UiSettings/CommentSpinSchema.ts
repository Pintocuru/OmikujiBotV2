// src/types/OmikujiData/UiSettings/CommentSpinSchema.ts
import { z } from 'zod'
import { DaisyUiThemeFieldsSchema } from '@shared/styles/DaisyUiTheme'
import { normalizedObject } from '../ParsedDefault'

/**
 * ライブクロック CommentSpin
 */
export const spinComponentMap = {
  standard: {
    label: '語尾ルーレット',
    accessLevel: 'pro',
    isColor: true,
  },
} as const

const spinComponentsEnum = Object.keys(spinComponentMap) as spinComponent[]
export type spinComponent = keyof typeof spinComponentMap

export const CommentSpinSchema = z.object({
  component: z.enum(spinComponentsEnum).default('standard').catch('standard'),
  color: normalizedObject(DaisyUiThemeFieldsSchema), // DaisyUIテーマカラー
  // 回り方（アニメーションのしかた）といったプロパティも追加したい
})
export type CommentSpinType = z.infer<typeof CommentSpinSchema>
