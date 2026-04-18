// src/ConfigMaker/UiEditor/CommonStyle/useVisibleOptions.ts
import { computed, type ComputedRef } from 'vue'
import type { AccessLevelType } from '@shared/types'
import { useSettingMode } from '@config/scripts/useAccessCheckerConfig'
import { hasAccessPure } from '@/common/FeatureAccess/useAccessChecker'

export type BaseComponentConfig = {
  label: string
  accessLevel: AccessLevelType
}

export function useVisibleOptions<T extends Record<string, BaseComponentConfig>>(
  options: T
): {
  visibleOptions: ComputedRef<Partial<T>>
} {
  const { accessMode } = useSettingMode()

  const visibleOptions = computed(() => {
    return Object.fromEntries(
      Object.entries(options).filter(([_, config]) => hasAccessPure(config.accessLevel, accessMode.value))
    ) as Partial<T>
  })

  return {
    visibleOptions,
  }
}
