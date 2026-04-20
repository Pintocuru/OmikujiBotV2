// src/MainGenerator/layouts/LayoutMaps.ts
import { UiSpecialSetType } from '@/types'

export const SPECIAL_SET_LAYOUT_LOADER: Record<UiSpecialSetType, () => Promise<any>> = {
  OmikujiBot: () => import('./OmikujiBot/OmikujiBot.vue'),
  VarietySlot: () => import('./VarietySlot/VarietySlot.vue'),
  VarietySlotRanking: () => import('./VarietySlot/VarietySlotRanking.vue'),
  GogoBonus: () => import('./GogoBonus/GogoBonus.vue'),
  Golden65536: () => import('./Golden65536/Golden65536.vue'),
}
