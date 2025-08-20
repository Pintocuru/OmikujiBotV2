// src/configMaker/composables/useCategoryUtils.ts
import { storeToRefs } from 'pinia'
import { categoryLabels, CategoryType } from '@/types/'
import { useOmikujiStore } from '@ConfigStores/useOmikujiStore'
import { computed } from 'vue'

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
    if (!visibility.comments) excludeKeys.push('comments')
    if (!visibility.timers) excludeKeys.push('timers')
    if (!visibility.placeholders) excludeKeys.push('placeholders')
    if (!visibility.characters) excludeKeys.push('characters')
    if (!visibility.wordPartySettings) excludeKeys.push('wordPartySettings')
    if (!visibility.gameScriptSettings || visibility.gameScripts.length === 0) {
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
