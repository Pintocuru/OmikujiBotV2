// src/ConfigMaker/scripts/useCommonStyleUpdate.ts
import { useOmikujiStore } from '@config/stores/useOmikujiStore'
import type { ComponentsCommonStyle } from '@/types/OmikujiData/'

/**
 * ComponentsCommonStyleの更新用composable
 */
export function useCommonStyleUpdate() {
  const omikujiStore = useOmikujiStore()

  /**
   * commonStyleのフィールドを更新
   */
  const updateCommonStyleField = <K extends keyof ComponentsCommonStyle>(field: K, value: ComponentsCommonStyle[K]) => {
    omikujiStore.updateComponentsCommonStyle({
      [field]: value,
    })
  }

  return {
    updateCommonStyleField,
  }
}
