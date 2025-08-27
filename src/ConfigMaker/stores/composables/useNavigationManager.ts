// src/ConfigMaker/script/stores/composables/useNavigationManager.ts (ナビゲーション専用)
import { ref, computed } from 'vue'
import { CategoryType, RecordCategoryType, recordCategoryLabel } from '@/types/OmikujiData/CategoryType'
import type { useRecordOperations } from './useRecordOperations'

/**
 * ナビゲーション状態とカテゴリ/アイテム選択を管理
 */
export function useNavigationManager(recordOps: ReturnType<typeof useRecordOperations>) {
  // 状態
  const selectedCategory = ref<CategoryType>('comments')
  const selectedRuleId = ref<string | null>(null)

  /**
   * 計算プロパティ
   */
  const isRecordCategory = computed(() => recordCategoryLabel.includes(selectedCategory.value as RecordCategoryType))

  const currentCategoryItems = computed(() => {
    if (!isRecordCategory.value) return {}
    return recordOps.getCategoryMap(selectedCategory.value as RecordCategoryType)
  })

  const currentSelectedItem = computed(() => {
    if (!selectedRuleId.value || !isRecordCategory.value) return null
    return currentCategoryItems.value[selectedRuleId.value] || null
  })

  const orderedCategoryItems = computed(() => {
    return Object.values(currentCategoryItems.value).sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
  })

  const hasItems = computed(() => orderedCategoryItems.value.length > 0)

  /**
   * 操作
   */
  const selectCategory = (category: CategoryType) => {
    selectedCategory.value = category

    if (!recordCategoryLabel.includes(category as RecordCategoryType)) {
      selectedRuleId.value = null
      return
    }

    // 最初のアイテムを自動選択
    const firstItem = orderedCategoryItems.value[0]
    selectedRuleId.value = firstItem?.id || null
  }

  const selectRule = (id: string) => {
    selectedRuleId.value = id
  }

  const clearSelection = () => {
    selectedRuleId.value = null
  }

  /**
   * アイテム削除後の選択更新
   */
  const selectItemAfterDeletion = (deletedId: string, category: RecordCategoryType) => {
    if (selectedRuleId.value !== deletedId || category !== selectedCategory.value) {
      return // 削除対象が選択中でない、または別カテゴリの場合は何もしない
    }

    const items = recordOps.getCategoryMap(category)
    const deletedItem = items[deletedId]
    const currentOrder = deletedItem?.order ?? 0

    // 利用可能なアイテムを取得（削除対象を除外）
    const availableItems = Object.entries(items)
      .filter(([key]) => key !== deletedId)
      .map(([key, item]) => ({ id: key, order: item.order ?? 0 }))
      .sort((a, b) => a.order - b.order)

    if (availableItems.length === 0) {
      selectedRuleId.value = null
      return
    }

    // 削除アイテムより小さいorder値のアイテムを探す
    const previousItem = availableItems
      .slice()
      .reverse()
      .find((item) => item.order < currentOrder)

    selectedRuleId.value = previousItem?.id || availableItems[0]?.id || null
  }

  return {
    // 状態
    selectedCategory,
    selectedRuleId,

    // 計算プロパティ
    isRecordCategory,
    currentCategoryItems,
    currentSelectedItem,
    orderedCategoryItems,
    hasItems,

    // 操作
    selectCategory,
    selectRule,
    clearSelection,
    selectItemAfterDeletion,
  }
}
