// src\MainGenerator\components\CommentBubble\composables\useMessageFilter.ts
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useAppStore } from '@/MainGenerator/stores/useAppStore'
import { useMessageFilterCore } from '@/common/CharacterManager/useMessageFilterCore'
import { ShowCharactersSchema } from '@/types'
import { useVisibilityAccess } from '@/MainGenerator/scripts/FeatureAccess/useAccessCheckerMain'

export const useMessageFilter = () => {
  const appStore = useAppStore()
  const { botMessages, data } = storeToRefs(appStore)
  const { isCharacter } = useVisibilityAccess()

  // キャラクターを表示しないときの showCharacters の default
  const defaultShowCharacters = computed(() =>
    ShowCharactersSchema.parse({
      center: ['default'],
      slot1: [],
      slot2: [],
      slot3: [],
      slot4: [],
    })
  )

  const showCharacters = computed(() => data.value.components.bubble.showCharacters)

  return useMessageFilterCore(botMessages, isCharacter.value ? showCharacters : defaultShowCharacters)
}
