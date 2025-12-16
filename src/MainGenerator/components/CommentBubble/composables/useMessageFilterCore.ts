// src\MainGenerator\components\CommentBubble\composables\useMessageFilterCore.ts
import { computed, ref, watch, type Ref } from 'vue'
import type { BotMessage } from '@/types/'

export const useMessageFilterCore = (botMessages: Ref<BotMessage[]>, showCharacters: Ref<string[][]>) => {
  const lastCommenterKey = ref<string | null>(null)

  watch(
    () => botMessages.value.length,
    () => {
      const list = botMessages.value
      if (list.length === 0) return

      const latest = list[list.length - 1]
      if (latest?.characterKey) {
        lastCommenterKey.value = latest.characterKey
      }
    },
    { immediate: true }
  )

  const zeroIndexMessages = computed(() => {
    const group = showCharacters.value[0]
    if (!group?.length) return []
    return botMessages.value.filter((m) => group.includes(m.characterKey))
  })

  const getMessagesForCharacter = (characterKey: string) =>
    botMessages.value.filter((m) => m.characterKey === characterKey)

  const selectCharacterFromGroup = (group: string[]) => {
    if (!group?.length) return null
    for (let i = group.length - 1; i >= 0; i--) {
      if (getMessagesForCharacter(group[i]).length) return group[i]
    }
    return group[0]
  }

  const visibleCharacterGroups = computed(() => {
    return showCharacters.value
      .slice(1)
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

  const isLastCommenter = (characterKey: string) => lastCommenterKey.value === characterKey

  return {
    zeroIndexMessages,
    visibleCharacterGroups,
    getMessagesForCharacter,
    isLastCommenter,
    lastCommenterKey,
  }
}
