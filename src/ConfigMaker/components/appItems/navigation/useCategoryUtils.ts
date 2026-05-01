// src/ConfigMaker/components/appItems/navigation/useCategoryUtils.ts
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { categoryMap, CategoryType } from '@/types'
import { useOmikujiStore } from '@config/stores/useOmikujiStore'
import { useAccessChecker } from '@config/scripts/useAccessCheckerConfig'
import { isDev } from '@/types'
import { useGetRecordData } from '@config/stores/useGetRecordData'

export const useCategoryUtils = () => {
  const omikujiStore = useOmikujiStore()
  const { data } = storeToRefs(omikujiStore)
  const { getCategoryArray } = useGetRecordData()
  const { hasAccess } = useAccessChecker()

  /**
   * ナビゲーションのアイテム数バッジ表示
   */
  const getCategoryItemCount = (category: CategoryType): number => {
    if (category === 'dataPacks') return 0 // TODO:いつか「パッケージ数」を取得できるようにする
    if (category === 'appInfo' || category === 'components') return 0
    if (category === 'jsonMerge') return data.value.jsonMerge.length
    return getCategoryArray(category).length
  }

  /**
   * ナビゲーションの表示・非表示設定
   */
  const filteredCategoryLabels = computed<Record<CategoryType, (typeof categoryMap)[CategoryType]>>(() => {
    const { usage, developer } = data.value.featureUsage

    const excludeKeys: CategoryType[] = []

    // usage の設定に基づいて非表示にするカテゴリを決定
    if (!isDev || !hasAccess(developer.jsonMergeSettings)) excludeKeys.push('jsonMerge') // 開発者のみの機能
    if (!hasAccess(usage.comments)) excludeKeys.push('comments')
    if (!hasAccess(usage.timers)) excludeKeys.push('timers')
    if (!hasAccess(usage.metas)) excludeKeys.push('metas')
    if (!hasAccess(usage.reactions)) excludeKeys.push('reactions')
    // if (!hasAccess(usage.queues)) excludeKeys.push('queues') // TODO:queues(order、参加型管理)の実装

    if (!hasAccess(usage.actionSets)) excludeKeys.push('actionSets')
    if (!hasAccess(usage.placeholders)) excludeKeys.push('placeholders')
    if (!hasAccess(usage.characters)) excludeKeys.push('characters')

    return Object.fromEntries(
      Object.entries(categoryMap).filter(([key]) => !excludeKeys.includes(key as CategoryType))
    ) as Record<CategoryType, (typeof categoryMap)[CategoryType]>
  })

  return {
    getCategoryItemCount,
    filteredCategoryLabels,
  }
}
