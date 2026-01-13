// src/ConfigMaker/components/rules/CharacterChanger/composables/useCharacterStats.ts
import { computed, ComputedRef } from 'vue'
import { ActionSetType, PostActionType } from '@/types/OmikujiData/'
import { useCharacterManager } from '@config/scripts/CharacterManager/useCharacterManager'
import { usePostActionCharacters } from './usePostActionCharacters'

/**
 * キャラクター使用状況の統計情報を提供
 */
export function useCharacterStats(allActionSets: ComputedRef<ActionSetType[]>) {
  const { isValidCharacter } = useCharacterManager()
  const { extractCharacterKeysFromActionSet, countCharacterUsageFromActionSet } = usePostActionCharacters()

  /**
   * 使用されている全キャラクターキー
   */
  const uniqueCharacterKeys = computed(() => {
    const keys = new Set<string>()
    allActionSets.value.forEach((actionSet) => {
      extractCharacterKeysFromActionSet(actionSet).forEach((key) => keys.add(key))
    })
    return Array.from(keys).sort()
  })

  /**
   * 各キャラクターの使用箇所数
   */
  const characterUsageCount = computed(() => {
    const counts: Record<string, number> = {}
    allActionSets.value.forEach((actionSet) => {
      const setCounts = countCharacterUsageFromActionSet(actionSet)
      Object.entries(setCounts).forEach(([key, count]) => {
        counts[key] = (counts[key] || 0) + count
      })
    })
    return counts
  })

  /**
   * 未定義キャラクターの数
   */
  const invalidCharacterCount = computed(() => {
    return uniqueCharacterKeys.value.filter((key) => !isValidCharacter(key)).length
  })

  /**
   * 未定義キャラクターが存在するか
   */
  const hasInvalidCharacters = computed(() => {
    return invalidCharacterCount.value > 0
  })

  return {
    uniqueCharacterKeys,
    characterUsageCount,
    invalidCharacterCount,
    hasInvalidCharacters,
  }
}
