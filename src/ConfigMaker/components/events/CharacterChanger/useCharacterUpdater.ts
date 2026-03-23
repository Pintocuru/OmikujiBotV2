// src/ConfigMaker/components/events/CharacterChanger/useCharacterUpdater.ts
import { ComputedRef } from 'vue'
import { useOmikujiStore } from '@config/stores/useOmikujiStore'
import { EventType } from '@/types/OmikujiData/'
import { ActionSetType, OmikujiItemType } from '@/types/OmikujiData/'
import { TargetCategoryType } from './useDataExtractor'
import { usePostActionCharacters } from './usePostActionCharacters'

/**
 * キャラクターの一括更新処理を提供
 */
export function useCharacterUpdater(
  category: TargetCategoryType,
  allItems: ComputedRef<(EventType | ActionSetType)[]>
) {
  const omikujiStore = useOmikujiStore()
  const { applyCharacterMappings } = usePostActionCharacters()

  /**
   * キャラクターマッピングを適用してアイテムを更新
   */
  const applyMappingsToAllItems = (mappings: Record<string, string>) => {
    if (category === 'actionSets') {
      const items = allItems.value as ActionSetType[]
      items.forEach((item) => {
        const updatedActionSet = applyCharacterMappings(item, mappings)
        omikujiStore.updateItem('actionSets', item.key, updatedActionSet)
      })
    } else {
      const rules = allItems.value as EventType[]
      rules.forEach((rule) => {
        const newOmikujiSets = rule.omikuji.map((omikuji: OmikujiItemType) => {
          // OmikujiItemTypeのプロパティを保持しつつ、characterKeyを更新
          const updatedActionSetPart = applyCharacterMappings(omikuji, mappings)

          return {
            ...omikuji, // weight, isPriority, criteria などを保持
            ...updatedActionSetPart, // postActions, gameScripts などを更新
          } as OmikujiItemType
        })

        omikujiStore.updateItem(category, rule.key, {
          omikuji: newOmikujiSets,
        })
      })
    }
  }

  return {
    applyMappingsToAllItems,
  }
}
