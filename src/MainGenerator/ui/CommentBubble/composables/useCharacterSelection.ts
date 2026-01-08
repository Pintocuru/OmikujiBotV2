// src/MainGenerator/composables/useCharacterSelection.ts
import { computed, type Ref } from 'vue'
import type { BotMessageType, ShowCharacters, CharacterType } from '@/types/'
import { DisplayBotMessage } from './useBotDisplay'

/**
 * キャラクター選択ロジックを集約
 * - グループからキャラクターを選択
 * - 表示するキャラクターリストを生成
 */
export function useCharacterSelection(
  displayedComments: Ref<DisplayBotMessage[]>,
  showCharacters: Ref<ShowCharacters>,
  charactersMap: Ref<Record<string, CharacterType>>
) {
  // 最新コメントのキャラクターキーを取得
  const latestCommenterKey = computed(() => {
    const visibleMessages = displayedComments.value.filter((m) => m.visible)
    return visibleMessages[0]?.bubble?.characterKey ?? null
  })

  // 指定キャラクターのメッセージ数を取得
  const getMessageCount = (characterKey: string): number => {
    return displayedComments.value.filter((m) => m.bubble?.characterKey === characterKey).length
  }

  /**
   * グループから表示するキャラクターを選択
   * 1. 最新コメントがグループ内にあればそれを優先
   * 2. コメント数が多い順
   * 3. グループの先頭
   */
  const selectCharacterFromGroup = (group: string[]): string | null => {
    if (!group?.length) return null

    // 1. 最新コメントがこのグループ内なら優先
    if (latestCommenterKey.value && group.includes(latestCommenterKey.value)) {
      return latestCommenterKey.value
    }

    // 2. コメント数が最も多いキャラクターを探す
    const withCounts = group.map((key) => ({
      key,
      count: getMessageCount(key),
    }))

    const hasComments = withCounts.find((c) => c.count > 0)
    if (hasComments) {
      return withCounts.sort((a, b) => b.count - a.count)[0].key
    }

    // 3. デフォルトは先頭
    return group[0]
  }

  // 0番地（中央）に表示するメッセージ
  const centerMessages = computed(() => {
    const allowKeys = showCharacters.value.center ?? []
    if (allowKeys.length === 0) return []

    return displayedComments.value.filter((message) => {
      if (!message.bubble?.characterKey) return true // キャラクター非表示モード
      return allowKeys.includes(message.bubble?.characterKey)
    })
  })

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
      .filter(Boolean) as Array<{ slotIndex: number; character: CharacterType }>
  })

  return {
    latestCommenterKey,
    centerMessages,
    slotCharacters,
    getMessageCount,
  }
}
