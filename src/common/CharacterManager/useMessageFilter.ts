// src\common\CharacterManager\useMessageFilter.ts
import { computed, type Ref } from 'vue'
import type { BotMessage } from '@/types/'
import type { ShowCharacters } from '@/types/' // ShowCharactersの型をインポート

export const useMessageFilter = (botMessages: Ref<BotMessage[]>, showCharacters: Ref<ShowCharacters>) => {
  // 0番地のコメント取得
  const zeroIndexMessages = computed(() => {
    const allowKeys = showCharacters.value.center ?? []

    // centerが空の場合は何も表示しない
    if (allowKeys.length === 0) return []

    return botMessages.value.filter((message) => {
      // null の場合はキャラクター非表示モードなのでそのまま表示させる
      if (message.characterKey === null) return true
      return allowKeys.includes(message.characterKey)
    })
  })

  // ???
  const getMessagesForCharacter = (characterKey: string) =>
    botMessages.value.filter((m) => m.characterKey === characterKey)

  // ???
  const selectCharacterFromGroup = (group: string[]) => {
    if (!group?.length) return null
    for (let i = group.length - 1; i >= 0; i--) {
      if (getMessagesForCharacter(group[i]).length) return group[i]
    }
    return group[0]
  }

  // ???
  const visibleCharacterGroups = computed(() => {
    const slots = [
      showCharacters.value.slot1,
      showCharacters.value.slot2,
      showCharacters.value.slot3,
      showCharacters.value.slot4,
    ]

    return slots
      .map((group, index) => {
        const key = selectCharacterFromGroup(group)
        return key
          ? {
              groupIndex: index + 1,
              characterKey: key,
              hasComments: getMessagesForCharacter(key).length > 0,
            }
          : null
      })
      .filter(Boolean) as { groupIndex: number; characterKey: string; hasComments: boolean }[]
  })

  return {
    zeroIndexMessages,
    visibleCharacterGroups,
    getMessagesForCharacter,
  }
}
