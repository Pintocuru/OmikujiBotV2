// src/common/FeatureAccess/useAccessChecker.ts
import { computed, type Ref } from 'vue'
import { OmikujiDataType, UiKind, UiSlotType } from '@/types'
import { useSettingModeFromHash } from './SettingMode'
import { AccessLevelType } from '@shared/types'

/**
 * アクセスレベルをチェックする関数
 */
const AccessLevelPriority: Record<AccessLevelType, number> = {
  none: 0,
  basic: 1,
  adv: 2,
  pro: 3,
  godMode: 4,
}

export function hasAccessPure(level: AccessLevelType, accessMode: AccessLevelType): boolean {
  // none なら必ず非表示
  if (level === 'none') return false
  return AccessLevelPriority[accessMode] >= AccessLevelPriority[level]
}

export function useAccessCheckerCore(accessMode: Ref<AccessLevelType>) {
  const hasAccess = (level: AccessLevelType) => hasAccessPure(level, accessMode.value)
  return { hasAccess }
}

/**
 * FeatureUsage に基づいて機能の表示・実行可否を判定
 */
export function useVisibilityAccessCore(data: Ref<OmikujiDataType>) {
  // setting mode
  const { accessMode } = useSettingModeFromHash(computed(() => data.value.settings.licenseKeyHash))
  const { hasAccess } = useAccessCheckerCore(accessMode)

  // featureUsage
  const usage = computed(() => data.value.featureUsage.usage)
  const developer = computed(() => data.value.featureUsage.developer)

  const canShowUsage = (key: keyof typeof usage.value): boolean => hasAccess(usage.value[key])
  const canShowDeveloper = (key: keyof typeof developer.value): boolean => hasAccess(developer.value[key])

  // Events
  const isComment = computed(() => hasAccess(usage.value.comments))
  const isTimer = computed(() => hasAccess(usage.value.timers))
  const isRules = computed(() => isComment.value || isTimer.value)

  // assets
  const isActionSet = computed(() => hasAccess(usage.value.actionSets))
  const isPlaceholder = computed(() => hasAccess(usage.value.placeholders))
  const isCharacter = computed(() => hasAccess(usage.value.characters) && Object.keys(data.value.characters).length > 0)

  // itemSlot
  const hasSlot = (slot: UiSlotType) => data.value.components.conditions.some((c) => c.slot === slot)
  function hasCondition(slot: UiSlotType, kind: UiKind): boolean {
    return data.value.components.conditions.some((c) => c.slot === slot && c.kind === kind)
  }

  const isPrimarySlot = computed(() => hasSlot('primary'))
  const isSecondarySlot = computed(() => hasSlot('secondary'))
  const isExtraSlot = computed(() => hasSlot('extra'))
  const isAllSlot = computed(() => isPrimarySlot.value || isSecondarySlot.value || isExtraSlot.value)

  return {
    canShowUsage,
    canShowDeveloper,
    isComment,
    isTimer,
    isRules,
    isActionSet,
    isPlaceholder,
    isCharacter,

    // 別に移すかも
    hasCondition,
    isPrimarySlot,
    isSecondarySlot,
    isExtraSlot,
    isAllSlot,
  }
}
