// src/ConfigMaker/components/events/CharacterChanger/useCharacterStats.ts
import { computed, ComputedRef } from 'vue'
import { ActionSetType } from '@/types/OmikujiData/'
import { useCharacterManager } from '@config/scripts/CharacterManager/useCharacterManager'
import { usePostActionCharacters } from './usePostActionCharacters'

/**
 * キャラクター使用状況の統計情報を提供
 */
export function useCharacterStats(allActionSets: ComputedRef<ActionSetType[]>) {
  const { characterArray } = useCharacterManager()
  const { extractCharacterKeys, countCharacterUsage } = usePostActionCharacters()

  /**
   * 使用されている全キャラクターキー
   */
  const uniqueCharacterKeys = computed(() => {
    const keys = new Set<string>()
    allActionSets.value.forEach((actionSet) => {
      extractCharacterKeys(actionSet).forEach((key) => keys.add(key))
    })
    return Array.from(keys)
  })

  /**
   * 各キャラクターの使用箇所数
   */
  const characterUsageCount = computed(() => {
    const counts: Record<string, number> = {}
    allActionSets.value.forEach((actionSet) => {
      const setCounts = countCharacterUsage(actionSet)
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
    const validKeys = new Set(characterArray.value.map((c) => c.key).filter((key) => key && key.trim() !== ''))
    return uniqueCharacterKeys.value.filter((key) => !validKeys.has(key)).length
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
