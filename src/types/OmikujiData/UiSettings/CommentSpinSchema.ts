// src/types/OmikujiData/UiSettings/CommentSpinSchema.ts
import { z } from 'zod'
import { DaisyUiThemeFieldsSchema } from '@shared/styles/DaisyUiTheme'
import { normalizedObject } from '../ParsedDefault'

export const spinComponentMap = {
  standard: {
    label: '語尾ルーレット',
    accessLevel: 'pro',
    isColor: true,
  },
  character: {
    label: 'キャラクタールーレット',
    accessLevel: 'pro',
    isColor: true,
  },
} as const

const spinComponentsEnum = Object.keys(spinComponentMap) as spinComponent[]
export type spinComponent = keyof typeof spinComponentMap

export const CommentSpinSchema = z.object({
  component: z.enum(spinComponentsEnum).default('standard').catch('standard'),
  color: normalizedObject(DaisyUiThemeFieldsSchema),
  size: z
    .object({
      width: z.number().default(320).catch(320), // px
      height: z.number().default(96).catch(96), // px（アニメーション計算にも使う）
    })
    .default({ width: 320, height: 96 }),
})
export type CommentSpinType = z.infer<typeof CommentSpinSchema>
