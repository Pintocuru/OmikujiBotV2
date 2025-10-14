// src\ConfigMaker\components\appItems\useCategoryUtils.ts
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { categoryLabels, CategoryType } from '@/types/OmikujiData/CategoryType'
import { useOmikujiStore } from '@ConfigStores/useOmikujiStore'
import { hasAccess } from '@/ConfigMaker/scripts/useSettingMode'
import { isDev } from '@/types'

export const useCategoryUtils = () => {
  const omikujiStore = useOmikujiStore()
  const { data } = storeToRefs(omikujiStore)

  /**
   * ナビゲーションのアイテム数バッジ表示
   */
  const getCategoryItemCount = (category: CategoryType): number => {
    const { gameScripts } = data.value.displaySettings.developer.visibility

    if (category === 'scriptSettings') return gameScripts.length
    if (category === 'displaySettings') return 0
    if (category === 'meta') return 0

    const items = data.value[category]
    return items ? Object.keys(items).length : 0
  }

  /**
   * ナビゲーションの表示・非表示設定
   */
  const filteredCategoryLabels = computed<Record<CategoryType, (typeof categoryLabels)[CategoryType]>>(() => {
    const { visibility } = data.value.displaySettings.developer

    const excludeKeys: CategoryType[] = []

    // visibility の設定に基づいて非表示にするカテゴリを決定
    if (!isDev) excludeKeys.push('jsonMerge') // 開発者のみの機能
    if (!hasAccess(visibility.comments)) excludeKeys.push('comments')
    if (!hasAccess(visibility.timers)) excludeKeys.push('timers')
    if (!hasAccess(visibility.placeholders)) excludeKeys.push('placeholders')
    if (!hasAccess(visibility.characters)) excludeKeys.push('characters')
    if (!hasAccess(visibility.wordPartySettings)) excludeKeys.push('wordPartySettings')
    if (!hasAccess(visibility.gameScriptSettings) || visibility.gameScripts.length === 0) {
      excludeKeys.push('scriptSettings')
    }

    return Object.fromEntries(
      Object.entries(categoryLabels).filter(([key]) => !excludeKeys.includes(key as CategoryType))
    ) as Record<CategoryType, (typeof categoryLabels)[CategoryType]>
  })

  return {
    getCategoryItemCount,
    filteredCategoryLabels,
  }
}
