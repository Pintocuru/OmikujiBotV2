import { computed, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useAppStore } from '@/MainGenerator/stores/useAppStore'
import type { BotMessage } from '@/types/'

/**
 * メッセージフィルタリング専用composable
 * showCharactersの設定に基づいてメッセージを振り分ける
 */
export const useMessageFilter = () => {
  const appStore = useAppStore()
  const { botMessages, data } = storeToRefs(appStore)

  // showCharacters設定を取得
  const showCharacters = computed(() => data.value.displaySettings?.components?.bubble?.showCharacters || [])

  // 最後にコメントしたキャラクターのキーを追跡
  const lastCommenterKey = ref<string | null>(null)

  // メッセージ追加を監視して最後のコメント者を更新
  watch(
    () => botMessages.value.length,
    () => {
      if (botMessages.value.length > 0) {
        const latestMessage = botMessages.value[botMessages.value.length - 1]
        if (latestMessage.characterKey) {
          lastCommenterKey.value = latestMessage.characterKey
        }
      }
    },
    { immediate: true }
  )

  /**
   * 0番地用: 指定キャラのメッセージを全て取得（混合表示）
   */
  const zeroIndexMessages = computed(() => {
    if (!showCharacters.value || showCharacters.value.length === 0) {
      return []
    }

    const zeroIndexKeys = showCharacters.value[0] || []
    if (zeroIndexKeys.length === 0) {
      return []
    }

    return botMessages.value.filter((msg) => zeroIndexKeys.includes(msg.characterKey))
  })

  /**
   * 1番地以降用: グループごとに表示すべきキャラクターのキーを取得
   * @returns { groupIndex: number, characterKey: string, hasComments: boolean }[]
   */
  const visibleCharacterGroups = computed(() => {
    if (!showCharacters.value || showCharacters.value.length <= 1) {
      return []
    }

    const groups = showCharacters.value.slice(1) // 1番地以降
    const result: { groupIndex: number; characterKey: string; hasComments: boolean }[] = []

    groups.forEach((group, index) => {
      const selectedKey = selectCharacterFromGroup(group)
      if (selectedKey) {
        const messages = getMessagesForCharacter(selectedKey)
        result.push({
          groupIndex: index + 1, // 実際のインデックス（1番地から）
          characterKey: selectedKey,
          hasComments: messages.length > 0,
        })
      }
    })

    return result
  })

  /**
   * グループ内から表示すべきキャラクターのキーを選択
   * ルール: コメントがあるキャラ（優先度高い順）→ なければデフォルト（0番目）
   */
  const selectCharacterFromGroup = (group: string[]): string | null => {
    if (!group || group.length === 0) return null

    const defaultKey = group[0]

    // 優先度が高い順（配列の後ろから）にコメントがあるキャラを探す
    for (let i = group.length - 1; i >= 0; i--) {
      const key = group[i]
      const messages = getMessagesForCharacter(key)
      if (messages.length > 0) {
        return key
      }
    }

    // コメントがなければデフォルトを返す
    return defaultKey
  }

  /**
   * 特定キャラクターのメッセージを取得
   */
  const getMessagesForCharacter = (characterKey: string): BotMessage[] => {
    return botMessages.value.filter((msg) => msg.characterKey === characterKey)
  }

  /**
   * キャラクターが最後にコメントしたかどうか
   */
  const isLastCommenter = (characterKey: string): boolean => {
    return lastCommenterKey.value === characterKey
  }

  return {
    zeroIndexMessages,
    visibleCharacterGroups,
    getMessagesForCharacter,
    isLastCommenter,
    lastCommenterKey,
  }
}
