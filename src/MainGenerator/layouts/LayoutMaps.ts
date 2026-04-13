// src/MainGenerator/ui/layouts/index.ts
import { UiSpecialSetType } from '@/types'

export const SPECIAL_SET_LAYOUT_LOADER: Record<UiSpecialSetType, () => Promise<any>> = {
  templa: () => import('./TemplaLayout.vue'),
}
