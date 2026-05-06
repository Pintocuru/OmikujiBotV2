// src/types/OmikujiData/UiSettings/KujibikiPanelSchema.ts
import { z } from 'zod'
import { enterMotionKeys } from './CommentBubbleSchema'

/**
 * くじ引き KujibikiPanel
 */
export const kujibikiComponentMap = {
  omikuji: {
    label: 'おみくじ',
    accessLevel: 'pro',
  },
  flower: {
    label: 'フラワー占い',
    accessLevel: 'basic',
  },
  tarot: {
    label: 'タロット',
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
})
export type KujibikiPanelType = z.infer<typeof KujibikiPanelSchema>
