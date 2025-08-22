// src/ConfigMaker/script/stores/composables/useNavigationState.ts
import { ref } from 'vue'
import {
  CategoryType,
  recordCategoryLabel,
  RecordCategoryType,
  RecordCategoryTypeMap,
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
    const items = getCategoryMap<RecordCategoryTypeMap[(typeof recordCategoryLabel)[number]]>(
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

  return {
    selectedCategory,
    selectedRuleId,
    selectCategory,
    selectRule,
    clearSelection,
  }
}
