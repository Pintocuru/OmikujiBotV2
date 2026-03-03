// src/ConfigMaker/components/UiEditor/CommonStyle/useCommonStyleUpdate.ts
import { useOmikujiStore } from '@config/stores/useOmikujiStore'
import type { UiCommonStyleType } from '@/types/OmikujiData/'

/**
 * ComponentsCommonStyleの更新用composable
 */
export function useCommonStyleUpdate() {
  const omikujiStore = useOmikujiStore()

  /**
   * commonStyleのフィールドを更新
   */
  const updateCommonStyleField = <K extends keyof UiCommonStyleType>(field: K, value: UiCommonStyleType[K]) => {
    omikujiStore.updateComponentsCommonStyle({
      [field]: value,
    })
  }

  return {
    updateCommonStyleField,
  }
}
