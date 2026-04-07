// src/ConfigMaker/components/events/IconKeyChanger/useIconKeyStats.ts
import { computed, ComputedRef } from 'vue'
import { ActionSetType } from '@/types/OmikujiData/'
import { usePostActionCharacters } from '../CharacterChanger/usePostActionCharacters'

/**
 * iconKey使用状況の統計情報を提供
 */
export function useIconKeyStats(allActionSets: ComputedRef<ActionSetType[]>) {
  const { extractInvalidIconKeyPairs, countIconKeyUsage } = usePostActionCharacters()

  /**
   * 不正な { characterKey, iconKey } ペアの一覧（重複なし）
   */
  const invalidIconKeyPairs = computed(() => {
    const seen = new Set<string>()
    const pairs: { characterKey: string; iconKey: string }[] = []

    allActionSets.value.forEach((actionSet) => {
      extractInvalidIconKeyPairs(actionSet).forEach((pair) => {
        const key = `${pair.characterKey}:${pair.iconKey}`
        if (!seen.has(key)) {
          seen.add(key)
          pairs.push(pair)
        }
      })
    })

    return pairs
  })

  /**
   * 各 "characterKey:iconKey" の使用箇所数
   */
  const iconKeyUsageCount = computed(() => {
    const counts: Record<string, number> = {}

    allActionSets.value.forEach((actionSet) => {
      const setCounts = countIconKeyUsage(actionSet)
      Object.entries(setCounts).forEach(([key, count]) => {
        counts[key] = (counts[key] || 0) + count
      })
    })

    return counts
  })

  /**
   * 不正iconKeyが存在するか
   */
  const hasInvalidIconKeys = computed(() => invalidIconKeyPairs.value.length > 0)

  /**
   * 不正iconKeyの件数
   */
  const invalidIconKeyCount = computed(() => invalidIconKeyPairs.value.length)

  return {
    invalidIconKeyPairs,
    iconKeyUsageCount,
    hasInvalidIconKeys,
    invalidIconKeyCount,
  }
}
