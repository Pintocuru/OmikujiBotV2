// src\ConfigMaker\scripts\useAccessCheckerConfig.ts
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useSettingModeFromHash } from '@/common/FeatureAccess/SettingMode'
import { useOmikujiStore } from '@config/stores/useOmikujiStore'
import { useAccessCheckerCore, useVisibilityAccessCore } from '@/common/FeatureAccess/useAccessChecker'

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
  const { accessMode } = useSettingMode()
  return useAccessCheckerCore(accessMode)
}

/**
 * FeatureUsage に基づいて機能の表示・実行可否を判定
 */
export function useVisibilityAccess() {
  const omikujiStore = useOmikujiStore()
  const { data } = storeToRefs(omikujiStore)

  return useVisibilityAccessCore(data)
}
