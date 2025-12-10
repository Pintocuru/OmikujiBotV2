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
  return useSettingModeFromHash(computed(() => data.value.displaySettings.editor.licenseKeyHash))
}

/**
 * アクセスレベルをチェックする関数
 */
export const hasAccess = (visibilityLevel: AccessLevelType): boolean => {
  const { isPro, isGod } = useSettingMode()

  // experimental は常に非表示（isGodでも非表示）
  if (visibilityLevel === 'experimental') return false

  // internal は godMode のみ表示
  if (visibilityLevel === 'internal') return isGod.value

  // pro は pro または godMode で表示
  if (visibilityLevel === 'pro') return isPro.value

  // basic は全てのライセンスで表示
  if (visibilityLevel === 'basic') return true

  return false
}

/**
 * store の visibility を隠蔽して hasAccess を簡単に使えるラッパー
 */
export function useVisibilityAccess() {
  const omikujiStore = useOmikujiStore()
  const { data } = storeToRefs(omikujiStore)

  // developer.visibility を reactive に取り出し
  const visibility = computed(() => data.value.displaySettings.developer.visibility)

  // hasAccess を透過的に使える関数
  const canShow = (key: keyof typeof visibility.value): boolean => {
    return hasAccess(visibility.value[key] as AccessLevelType)
  }

  return {
    visibility,
    canShow,
  }
}
