// src/ConfigMaker/components/events/IconKeyChanger/useIconKeyUpdater.ts
import { ComputedRef } from 'vue'
import { useOmikujiStore } from '@config/stores/useOmikujiStore'
import { EventType, ActionSetType, OmikujiItemType } from '@/types/OmikujiData/'
import { TargetCategoryType } from '../CharacterChanger/useDataExtractor'
import { usePostActionCharacters } from '../CharacterChanger/usePostActionCharacters'

/**
 * iconKeyの一括更新処理を提供
 */
export function useIconKeyUpdater(category: TargetCategoryType, allItems: ComputedRef<(EventType | ActionSetType)[]>) {
  const omikujiStore = useOmikujiStore()
  const { applyIconKeyMappings } = usePostActionCharacters()

  /**
   * iconKeyマッピングを適用してアイテムを更新
   */
  const applyMappingsToAllItems = (mappings: Record<string, string>) => {
    if (category === 'actionSets') {
      const items = allItems.value as ActionSetType[]
      items.forEach((item) => {
        const updated = applyIconKeyMappings(item, mappings)
        omikujiStore.updateItem('actionSets', item.key, updated)
      })
    } else {
      const rules = allItems.value as EventType[]
      rules.forEach((rule) => {
        const newOmikuji = rule.omikuji.map((omikuji: OmikujiItemType) => {
          const updated = applyIconKeyMappings(omikuji, mappings)
          return { ...omikuji, ...updated } as OmikujiItemType
        })
        omikujiStore.updateItem(category, rule.key, { omikuji: newOmikuji })
      })
    }
  }

  return { applyMappingsToAllItems }
}
