// src/ConfigMaker/components/UiEditor/conditions/useUiVisibility.ts
import { computed, ComputedRef } from 'vue'
import { storeToRefs } from 'pinia'
import { useOmikujiStore } from '@config/stores/useOmikujiStore'
import { useSettingMode, useVisibilityAccess } from '@config/scripts/useAccessCheckerConfig'
import { UiKind } from '@/types'
import { VisibilityKey } from '../useUiItemMap'

export const useUiVisibility = () => {
  const store = useOmikujiStore()
  const { data } = storeToRefs(store)

  const visibility = useVisibilityAccess()
  const { isAdv, isPro, isGod } = useSettingMode()

  const conditions = computed(() => data.value.components.conditions)

  const hasComponentKind = (kind: UiKind) => conditions.value.some((c) => c.kind === kind)

  const settings = computed(() => data.value.components.settings)
  const isComponentEnabled = (kind: UiKind): boolean =>
    settings.value[kind as keyof typeof settings.value] !== undefined

  const visibilityMap: ComputedRef<Record<VisibilityKey, boolean>> = computed(() => ({
    comment: visibility.isComment.value,
    character: visibility.isCharacter.value,
    '!character': !visibility.isCharacter.value,
    primarySlot: visibility.isPrimarySlot.value,
    secondarySlot: visibility.isSecondarySlot.value,
    botSlot: visibility.isPrimarySlot.value || visibility.isSecondarySlot.value,
    allSlot: visibility.isAllSlot.value,
    adv: isAdv.value,
    pro: isPro.value,
    god: isGod.value,
  }))

  return {
    conditions,
    hasComponentKind,
    isComponentEnabled,
    visibilityMap,
  }
}
