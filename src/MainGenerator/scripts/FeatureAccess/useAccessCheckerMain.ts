// src\MainGenerator\scripts\useAccessCheckerMain.ts
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useAppStore } from '@main/stores/useAppStore'
import { useSettingModeFromHash } from '@/common/FeatureAccess/SettingMode'
import { useAccessCheckerCore, useVisibilityAccessCore } from '@/common/FeatureAccess/useAccessChecker'

/**
 * 各ライセンス状態を返す関数
 */
export function useSettingMode() {
  const omikujiStore = useAppStore()
  const { data } = storeToRefs(omikujiStore)
  return useSettingModeFromHash(computed(() => data.value.settings.licenseKeyHash))
}

/**
 * アクセスレベルをチェックする関数
 */
export function useAccessChecker() {
  const { isPro, isGod } = useSettingMode()
  return useAccessCheckerCore(isPro, isGod)
}

/**
 * FeatureUsage に基づいて機能の表示・実行可否を判定
 */
export function useVisibilityAccess() {
  const omikujiStore = useAppStore()
  const { data } = storeToRefs(omikujiStore)

  return useVisibilityAccessCore(data)
}
