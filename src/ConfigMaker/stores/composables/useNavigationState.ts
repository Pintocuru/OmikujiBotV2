// src/ConfigMaker/script/stores/composables/useNavigationState.ts
import { ref } from 'vue'
import {
  CategoryType,
  recordCategoryLabel,
  RecordCategoryType,
  RecordCategoryItemTypeMap,
} from '@/types/OmikujiData/CategoryType'

/**
 * ナビゲーション状態管理を提供するコンポーザブル
 */
export function useNavigationState() {
  const selectedCategory = ref<CategoryType>('comments')
  const selectedRuleId = ref<string | null>(null)

  /**
   * カテゴリを選択し、適切なルールを自動選択
   */
  const selectCategory = (
    category: CategoryType,
    getCategoryMap: <T>(category: RecordCategoryType) => Record<string, T>
  ) => {
    selectedCategory.value = category

    // 選択可能なカテゴリでない場合はルール選択をクリア
    if (!recordCategoryLabel.includes(category as RecordCategoryType)) {
      selectedRuleId.value = null
      return
    }

    // 最初のルールを自動選択（order順または最初のアイテム）
    const items = getCategoryMap<RecordCategoryItemTypeMap[(typeof recordCategoryLabel)[number]]>(
      category as RecordCategoryType
    )
    const firstId =
      Object.entries(items)
        .filter(([_, item]) => typeof item.order === 'number')
        .sort((a, b) => a[1].order - b[1].order)[0]?.[0] ??
      Object.keys(items)[0] ??
      null

    selectedRuleId.value = firstId
  }

  /**
   * 特定のルールを選択
   */
  const selectRule = (id: string) => {
    selectedRuleId.value = id
  }

  /**
   * ルール選択をクリア
   */
  const clearSelection = () => {
    selectedRuleId.value = null
  }

  /**
   * アイテム削除時の自動選択処理
   * 削除されるアイテムが選択中の場合、適切な代替を選択する
   */
  const handleItemDeletion = (
    deletedId: string,
    category: RecordCategoryType,
    getCategoryMap: <T>(category: RecordCategoryType) => Record<string, T>
  ) => {
    // 削除されるアイテムが選択中でない場合は何もしない
    if (selectedRuleId.value !== deletedId) {
      return
    }

    const items = getCategoryMap<RecordCategoryItemTypeMap[RecordCategoryType]>(category)
    const currentOrder = items[deletedId]?.order ?? 0

    // order順でソートされたアイテム配列を取得（削除対象を除外）
    const availableItems = Object.entries(items)
      .filter(([key]) => key !== deletedId)
      .map(([key, item]) => ({ id: key, order: item.order ?? 0 }))
      .sort((a, b) => a.order - b.order)

    if (availableItems.length === 0) {
      // アイテムが存在しない場合は選択をクリア
      selectedRuleId.value = null
      return
    }

    // 削除するアイテムより1つ小さいorder値のアイテムを探す
    const previousItem = availableItems.reverse().find((item) => item.order < currentOrder)

    if (previousItem) {
      selectedRuleId.value = previousItem.id
    } else {
      // 前のアイテムがない場合は、最初のアイテムを選択
      selectedRuleId.value = availableItems[availableItems.length - 1]?.id || null
    }
  }

  return {
    selectedCategory,
    selectedRuleId,
    selectCategory,
    selectRule,
    clearSelection,
    handleItemDeletion,
  }
}
