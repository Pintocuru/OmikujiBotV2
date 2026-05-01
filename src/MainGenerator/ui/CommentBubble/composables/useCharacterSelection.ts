// src/MainGenerator/ui/CommentBubble/composables/useCharacterSelection.ts
import { computed, Ref } from 'vue'
import { ShowCharacters, CharacterType, BotMessageBubbleType } from '@/types'
import { useCharacterManager } from '@main/scripts/CharacterManager/useCharacterManager'

/**
 * キャラクター選択ロジックを集約
 * - グループからキャラクターを選択
 * - 表示するキャラクターリストを生成
 */
export function useCharacterSelection(
  displayedComments: Ref<BotMessageBubbleType[]>,
  showCharacters: Ref<ShowCharacters>,
  charactersMap: Ref<Record<string, CharacterType>>
) {
  const { isValidCharacter } = useCharacterManager()

  // 最新コメントのキャラクターキーを取得
  const latestCommenterKey = computed(() => {
    const latestVisible = displayedComments.value.find((m) => m.display?.visible)
    return latestVisible?.bubble?.characterKey ?? null
  })

  // 指定キャラクターのメッセージ数を取得
  const getMessageCount = (characterKey: string): number => {
    return displayedComments.value.filter((m) => m.bubble?.characterKey === characterKey).length
  }

  /**
   * キャラクターの有効性を検証し、警告を出力
   */
  const validateAndWarn = (key: string, context: string): boolean => {
    const character = charactersMap.value[key]

    if (!character) {
      console.warn(`[CharacterSelection] Character "${key}" not found in map (${context})`)
      return false
    }

    if (!isValidCharacter(key)) {
      console.warn(`[CharacterSelection] Character "${key}" has no images (${context})`, {
        availableEmotions: Object.keys(character.image || {}),
      })
      return false
    }

    return true
  }

  /**
   * グループから表示するキャラクターを選択
   * 優先順位: 1) 最新コメント 2) コメント数が多い 3) グループ先頭
   */
  const selectCharacterFromGroup = (group: string[]): string | null => {
    if (!group?.length) return null

    // 1. 最新コメントがこのグループ内なら優先
    if (latestCommenterKey.value && group.includes(latestCommenterKey.value)) {
      if (validateAndWarn(latestCommenterKey.value, 'latest commenter')) {
        return latestCommenterKey.value
      }
    }

    // 2. コメント数が最も多いキャラクターを探す
    const withCounts = group
      .map((key) => ({ key, count: getMessageCount(key) }))
      .filter((item) => item.count > 0)
      .sort((a, b) => b.count - a.count)

    if (withCounts.length > 0) {
      const topKey = withCounts[0].key
      if (validateAndWarn(topKey, 'most comments')) {
        return topKey
      }
    }

    // 3. グループ内で最初に有効なキャラクターを探す
    for (const key of group) {
      if (validateAndWarn(key, 'group fallback')) {
        return key
      }
    }

    // 4. 有効なキャラクターがない場合
    console.warn(`[CharacterSelection] No valid characters in group`, {
      group,
      availableCharacters: Object.keys(charactersMap.value),
    })

    return null
  }

  // 1〜4番地に表示するキャラクターリスト
  const slotCharacters = computed<Array<{ slotIndex: number; character: CharacterType }>>(() => {
    const slots = [
      showCharacters.value.slot1,
      showCharacters.value.slot2,
      showCharacters.value.slot3,
      showCharacters.value.slot4,
    ]

    return slots
      .map((group, index) => {
        const key = selectCharacterFromGroup(group)
        if (!key) return null

        const character = charactersMap.value[key]
        if (!character) return null

        return {
          slotIndex: index + 1,
          character,
        }
      })
      .filter((item): item is { slotIndex: number; character: CharacterType } => item !== null)
  })

  return {
    latestCommenterKey,
    slotCharacters,
    getMessageCount,
  }
}
