// src\ConfigMaker\scripts\useSettingMode.ts
import { computed } from 'vue'
import { useSettingModeFromHash } from '@/types/SettingMode'
import { useOmikujiStore } from '@ConfigStores/useOmikujiStore'
import { storeToRefs } from 'pinia'

export function useSettingMode() {
  const omikujiStore = useOmikujiStore()
  const { data } = storeToRefs(omikujiStore)
  return useSettingModeFromHash(computed(() => data.value.displaySettings.licenseKeyHash))
}
