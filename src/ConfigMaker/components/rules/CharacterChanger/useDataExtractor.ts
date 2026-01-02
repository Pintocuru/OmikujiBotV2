// src/ConfigMaker/components/rules/CharacterChanger/composables/useDataExtractor.ts
import { computed, ComputedRef } from 'vue'
import { RulesCategoryType, RuleType, ActionSetType, PostActionType, OmikujiItemType } from '@/types/OmikujiData/'
import { useOmikujiStore } from '@ConfigStores/useOmikujiStore'
import { categoryLabels } from '@/types'

/**
 * カテゴリタイプ（rules系とactionSets）
 */
export type TargetCategoryType = RulesCategoryType | 'actionSets'

/**
 * 変更スコープタイプ
 */
export type ChangeScope = 'category' | 'single'

/**
 * 各カテゴリからPostAction配列を抽出するためのコンポーザブル
 * selectedIdがある場合は単一アイテムのみ、ない場合はカテゴリ全体を対象とする
 */
export function useDataExtractor(category: TargetCategoryType, selectedId?: string) {
  const omikujiStore = useOmikujiStore()

  // 変更スコープ（全体 or 単一）
  const changeScope = computed<ChangeScope>(() => (selectedId ? 'single' : 'category'))

  // スコープに応じたラベル
  const scopeLabel = computed(() => {
    if (changeScope.value === 'single') return 'このルール'
    return `${categoryLabels[category].label}全体`
  })

  /**
   * カテゴリ内の対象アイテムを取得
   * selectedIdがある場合は単一アイテム、ない場合は全アイテム
   */
  const allItems = computed(() => {
    if (category === 'actionSets') {
      const actionSets = omikujiStore.data.actionSets
      if (selectedId) {
        const item = actionSets[selectedId]
        return item ? [item] : []
      }
      return Object.values(actionSets) as ActionSetType[]
    } else {
      if (selectedId) {
        const item = omikujiStore.getItem(category, selectedId)
        return item ? [item as RuleType] : []
      }
      return omikujiStore.getCategoryArray(category) as RuleType[]
    }
  })

  /**
   * 全PostActionを平坦化して取得
   */
  const allPostActions: ComputedRef<PostActionType[]> = computed(() => {
    if (category === 'actionSets') {
      const items = allItems.value as ActionSetType[]
      return items.flatMap((item) => item.postActions)
    } else {
      const rules = allItems.value as RuleType[]
      return rules.flatMap((rule) => rule.omikuji.flatMap((omikuji: OmikujiItemType) => omikuji.postActions))
    }
  })

  /**
   * アイテム数
   */
  const totalItems = computed(() => allItems.value.length)

  return {
    changeScope,
    scopeLabel,
    allItems,
    allPostActions,
    totalItems,
  }
}
