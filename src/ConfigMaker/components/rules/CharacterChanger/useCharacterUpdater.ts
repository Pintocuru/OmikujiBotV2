// src/ConfigMaker/components/rules/CharacterChanger/composables/useCharacterUpdater.ts
// src/ConfigMaker/components/rules/CharacterChanger/composables/useCharacterUpdater.ts
import { ComputedRef } from 'vue'
import { useOmikujiStore } from '@ConfigStores/useOmikujiStore'
import { RuleType } from '@/types/OmikujiData/RulesSchema'
import { PostActionRecordType, OmikujiItemType } from '@/types/OmikujiData/OmikujiSchema'
import { TargetCategoryType } from './useDataExtractor'
import { usePostActionCharacters } from './usePostActionCharacters'

/**
 * キャラクターの一括更新処理を提供
 */
export function useCharacterUpdater(
  category: TargetCategoryType,
  allItems: ComputedRef<(RuleType | PostActionRecordType)[]>,
  selectedId?: string
) {
  const omikujiStore = useOmikujiStore()
  const { applyCharacterMappings } = usePostActionCharacters()

  /**
   * キャラクターマッピングを適用してアイテムを更新
   */
  const applyMappingsToAllItems = (mappings: Record<string, string>) => {
    if (category === 'actionSets') {
      // actionSetsの場合: postActionsを直接更新
      const items = allItems.value as PostActionRecordType[]
      items.forEach((item) => {
        const newPostActions = applyCharacterMappings(item.postActions, mappings)
        omikujiStore.updateItem('actionSets', item.id, {
          postActions: newPostActions,
        })
      })
    } else {
      // rules系の場合: omikuji内のpostActionsを更新
      const rules = allItems.value as RuleType[]
      rules.forEach((rule) => {
        const newOmikujiSets = rule.omikuji.map((omikuji: OmikujiItemType) => ({
          ...omikuji,
          postActions: applyCharacterMappings(omikuji.postActions, mappings),
        }))

        omikujiStore.updateItem(category, rule.id, {
          omikuji: newOmikujiSets,
        })
      })
    }
  }

  return {
    applyMappingsToAllItems,
  }
}
