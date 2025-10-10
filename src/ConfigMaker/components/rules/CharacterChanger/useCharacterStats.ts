// src/ConfigMaker/components/rules/CharacterChanger/composables/useCharacterStats.ts
import { computed, ComputedRef } from 'vue'
import { PostActionType } from '@/types/OmikujiData/OmikujiSchema'
import { useCharacterData } from './useCharacterData'
import { usePostActionCharacters } from './usePostActionCharacters'

/**
 * キャラクター使用状況の統計情報を提供
 */
export function useCharacterStats(allPostActions: ComputedRef<PostActionType[]>) {
  const { isValidCharacter } = useCharacterData()
  const { extractCharacterKeys, countCharacterUsage } = usePostActionCharacters()

  /**
   * 使用されている全キャラクターキー
   */
  const uniqueCharacterKeys = computed(() => {
    return extractCharacterKeys(allPostActions.value)
  })

  /**
   * 各キャラクターの使用箇所数
   */
  const characterUsageCount = computed(() => {
    return countCharacterUsage(allPostActions.value)
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
