// src/types/OmikujiData/UiSettings/KujibikiPanelSchema.ts
import { z } from 'zod'
import { enterMotionKeys } from './CommentBubbleSchema'

/**
 * くじ引き KujibikiPanel
 */
export const kujibikiComponentMap = {
  omikuji: {
    label: 'おみくじ',
    isVisual: false,
    accessLevel: 'pro',
  },
  flower: {
    label: 'フラワー占い',
    isVisual: false,
    accessLevel: 'basic',
  },
  tarot: {
    label: 'タロット',
    isVisual: false,
    accessLevel: 'pro',
  },
  faceCutout: {
    label: '顔ハメ看板',
    isVisual: true,
    accessLevel: 'pro',
  },
} as const

const kujibikiComponentsEnum = Object.keys(kujibikiComponentMap) as KujibikiComponent[]
export type KujibikiComponent = keyof typeof kujibikiComponentMap

export const KujibikiPanelSchema = z.object({
  component: z.enum(kujibikiComponentsEnum).default('omikuji').catch('omikuji'),
  label: z.string().default('くじ引き').catch('くじ引き'),
  animation: z.enum(enterMotionKeys).default('slideUp').catch('slideUp'),
  displaySeconds: z.number().min(0).max(60).default(10).catch(10),
  imagePath: z.string().optional(),
  iconSize: z.number().optional(),
})
export type KujibikiPanelType = z.infer<typeof KujibikiPanelSchema>
