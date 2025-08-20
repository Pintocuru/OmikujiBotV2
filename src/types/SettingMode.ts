// src\types\SettingMode.ts
import { computed } from 'vue'
import { useOmikujiStore } from '@ConfigStores/useOmikujiStore'
import { isDev } from './env'
import { storeToRefs } from 'pinia'

// 判定テーブル
const KEY_MAP: Record<string, 'pro' | 'godMode'> = {
  '2c26b46b68ffc68ff99b453c1d304134': 'pro',
  '5d41402abc4b2a76b9719d911017c592': 'godMode',
}
type SettingMode = 'basic' | 'pro' | 'godMode'

export function useSettingMode() {
  const omikujiStore = useOmikujiStore()
  const { data } = storeToRefs(omikujiStore)

  // computedを使ってリアクティブにキャッシュ
  const settingMode = computed((): SettingMode => {
    const { licenseKeyHash } = data.value.displaySettings
    return KEY_MAP[licenseKeyHash] ?? 'basic'
  })

  const isPro = computed(() => {
    const mode = settingMode.value
    return mode === 'pro' || mode === 'godMode'
  })

  const isGod = computed(() => {
    const mode = settingMode.value
    return mode === 'godMode'
  })

  return {
    settingMode,
    isPro,
    isGod,
  }
}
