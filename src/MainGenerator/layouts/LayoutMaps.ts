// src/MainGenerator/layouts/LayoutMaps.ts
import { UiSpecialSetType } from '@/types'

export const SPECIAL_SET_LAYOUT_LOADER: Record<UiSpecialSetType, () => Promise<any>> = {
  OmikujiBot: () => import('./OmikujiBot/OmikujiBot.vue'),
  VarietySlot: () => import('./VarietySlot/VarietySlot.vue'),
}
