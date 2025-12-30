// src\common\FeatureAccess\useAccessChecker.ts
import { computed, type Ref } from 'vue'
import { OmikujiDataType } from '@/types'
import { useSettingModeFromHash } from './SettingMode'
import { AccessLevelType } from '@shared/types'

/**
 * アクセスレベルをチェックする関数
 */
export function hasAccessPure(level: AccessLevelType, isPro: boolean, isGod: boolean): boolean {
  if (level === 'experimental') return false
  if (level === 'internal') return isGod
  if (level === 'pro') return isPro
  return true
}

export function useAccessCheckerCore(isPro: Ref<boolean>, isGod: Ref<boolean>) {
  const hasAccess = (level: AccessLevelType) => hasAccessPure(level, isPro.value, isGod.value)
  return { hasAccess }
}

/**
 * FeatureUsage に基づいて機能の表示・実行可否を判定
 */
export function useVisibilityAccessCore(data: Ref<OmikujiDataType>) {
  // setting mode
  const { isPro, isGod } = useSettingModeFromHash(computed(() => data.value.settings.licenseKeyHash))
  const { hasAccess } = useAccessCheckerCore(isPro, isGod)

  // featureUsage
  const usage = computed(() => data.value.featureUsage.usage)
  const developer = computed(() => data.value.featureUsage.developer)

  const canShowUsage = (key: keyof typeof usage.value): boolean => hasAccess(usage.value[key])
  const canShowDeveloper = (key: keyof typeof developer.value): boolean => hasAccess(developer.value[key])

  const isCharacter = computed(() => hasAccess(usage.value.characters) && Object.keys(data.value.characters).length > 0)
  const isPlaceholder = computed(() => hasAccess(usage.value.placeholders))

  return {
    canShowUsage,
    canShowDeveloper,
    isPlaceholder,
    isCharacter,
  }
}
