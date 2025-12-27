// src\ConfigMaker\scripts\useSettingMode.ts
import { computed } from 'vue'
import { useSettingModeFromHash } from '@/types/SettingMode'
import { useOmikujiStore } from '@ConfigStores/useOmikujiStore'
import { storeToRefs } from 'pinia'
import { AccessLevelType } from '@shared/types'

/**
 * 各ライセンス状態を返す関数
 */
export function useSettingMode() {
  const omikujiStore = useOmikujiStore()
  const { data } = storeToRefs(omikujiStore)
  return useSettingModeFromHash(computed(() => data.value.settings.licenseKeyHash))
}

/**
 * アクセスレベルをチェックする関数
 */
export function useAccessChecker() {
  const { isPro, isGod } = useSettingMode()

  const hasAccess = (level: AccessLevelType) => {
    if (level === 'experimental') return false
    if (level === 'internal') return isGod.value
    if (level === 'pro') return isPro.value
    return true
  }

  return { hasAccess }
}

/**
 * store の visibility を隠蔽して hasAccess を簡単に使えるラッパー
 */
export function useVisibilityAccess() {
  const omikujiStore = useOmikujiStore()
  const { data } = storeToRefs(omikujiStore)
  const { hasAccess } = useAccessChecker()

  // featureUsage
  const usage = computed(() => data.value.featureUsage.usage)
  const developer = computed(() => data.value.featureUsage.developer)

  const canShowUsage = (key: keyof typeof usage.value): boolean => hasAccess(usage.value[key] as AccessLevelType)
  const canShowDeveloper = (key: keyof typeof developer.value): boolean =>
    hasAccess(developer.value[key] as AccessLevelType)

  // isCharacter
  const isCharacter = computed(() => hasAccess(usage.value.characters) && Object.keys(data.value.characters).length > 0)
  const isPlaceholder = computed(() => hasAccess(data.value.featureUsage.usage.placeholders))

  return {
    canShowUsage,
    canShowDeveloper,
    isPlaceholder,
    isCharacter,
  }
}
