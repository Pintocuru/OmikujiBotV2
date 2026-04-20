// src/types/OmikujiData/UiSettings/CommentSpinSchema.ts
import { z } from 'zod'
import { AccessLevelType } from '@shared/types'

export const spinComponentMap = {
  standard: {
    label: 'ルーレット',
    accessLevel: 'pro',
    isColor: true,
    animations: ['vertical', 'horizontal'],
  },
  character: {
    label: 'スロット',
    accessLevel: 'pro',
    isColor: true,
    animations: ['vertical', 'horizontal'],
  },
  popup: {
    label: 'ポップアップ',
    accessLevel: 'pro',
    isColor: true,
    animations: ['vertical', 'horizontal'],
  },
  flipCalendar: {
    label: 'フリップ/カレンダー',
    accessLevel: 'godMode',
    isColor: true,
    animations: ['flip', 'calendar'],
  },
} as const satisfies Record<
  string,
  {
    label: string
    accessLevel: AccessLevelType
    isColor: boolean
    animations: readonly spinAnimation[]
  }
>
const spinComponentsEnum = Object.keys(spinComponentMap) as spinComponent[]
export type spinComponent = keyof typeof spinComponentMap

export const spinAnimationMap = {
  vertical: { label: '縦スロット', accessLevel: 'pro' },
  horizontal: { label: '横回転', accessLevel: 'pro' },
  flip: { label: 'コインフリップ', accessLevel: 'godMode' },
  calendar: { label: 'カレンダー', accessLevel: 'godMode' },
} as const
const spinAnimationEnum = Object.keys(spinAnimationMap) as spinAnimation[]
export type spinAnimation = keyof typeof spinAnimationMap

export const CommentSpinSchema = z.object({
  component: z.enum(spinComponentsEnum).default('standard').catch('standard'),
  animation: z.enum(spinAnimationEnum).default('vertical').catch('vertical'),
  size: z
    .object({
      width: z.number().default(320).catch(320), // px
      height: z.number().default(96).catch(96), // px（アニメーション計算にも使う）
    })
    .default({ width: 320, height: 96 }),
  durationSeconds: z.number().default(3).catch(3),
  logoPath: z.string().default('').catch(''),
})
export type CommentSpinType = z.infer<typeof CommentSpinSchema>
