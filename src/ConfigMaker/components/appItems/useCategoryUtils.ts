// src\ConfigMaker\components\appItems\useCategoryUtils.ts
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { categoryLabels, CategoryType } from '@/types/OmikujiData/'
import { useOmikujiStore } from '@config/stores/useOmikujiStore'
import { useAccessChecker } from '@config/scripts/useAccessCheckerConfig'
import { isDev } from '@/types/'

export const useCategoryUtils = () => {
  const omikujiStore = useOmikujiStore()
  const { data } = storeToRefs(omikujiStore)
  const { hasAccess } = useAccessChecker()

  /**
   * ナビゲーションのアイテム数バッジ表示
   */
  const getCategoryItemCount = (category: CategoryType): number => {
    if (category === 'appInfo') return 0
    if (category === 'jsonMerge') return data.value.jsonMerge.length

    const items = data.value[category]
    return items ? Object.keys(items).length : 0
  }

  /**
   * ナビゲーションの表示・非表示設定
   */
  const filteredCategoryLabels = computed<Record<CategoryType, (typeof categoryLabels)[CategoryType]>>(() => {
    const { usage, developer } = data.value.featureUsage

    const excludeKeys: CategoryType[] = []

    // usage の設定に基づいて非表示にするカテゴリを決定
    if (!isDev || !hasAccess(developer.jsonMergeSettings)) excludeKeys.push('jsonMerge') // 開発者のみの機能
    if (!hasAccess(usage.comments)) excludeKeys.push('comments')
    if (!hasAccess(usage.timers)) excludeKeys.push('timers')
    if (!hasAccess(usage.actionSets)) excludeKeys.push('actionSets')
    if (!hasAccess(usage.placeholders)) excludeKeys.push('placeholders')
    if (!hasAccess(usage.characters)) excludeKeys.push('characters')

    return Object.fromEntries(
      Object.entries(categoryLabels).filter(([key]) => !excludeKeys.includes(key as CategoryType))
    ) as Record<CategoryType, (typeof categoryLabels)[CategoryType]>
  })

  return {
    getCategoryItemCount,
    filteredCategoryLabels,
  }
}
