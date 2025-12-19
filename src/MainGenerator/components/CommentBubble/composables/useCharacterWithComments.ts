// src/MainGenerator/components/OmikujiBot/composables/useCharacterWithComments.ts
import { computed } from 'vue'
import { useViewBotCharacter } from './useViewBotCharacter'
import { useAppStore } from '@/MainGenerator/stores/useAppStore'
import type { CharacterType } from '@/types/'
import type { DisplayBotMessage } from '@/MainGenerator/components/CommentBubble/composables/useBotDisplay'

export function useCharacterWithComments(
  character: CharacterType | null,
  comments: DisplayBotMessage[],
  isActive: boolean
) {
  const { enterMotion } = useViewBotCharacter()
  const appStore = useAppStore()

  const style = computed(() => ({
    zIndex: isActive ? 50 : 0,
    filter: isActive ? 'brightness(100%)' : 'brightness(60%)',
  }))

  const bubble = computed(() => appStore.data.displaySettings.components.bubble)
  const bubbleTextAnimate = computed(() => appStore.data.displaySettings.components.bubble.bubbleTextAnimate)

  const conditions = computed(() => appStore.data.displaySettings.components.conditions || [])

  const showToastFallback = computed(() => !conditions.value.includes('toast'))

  return {
    style,
    bubble,
    bubbleTextAnimate,
    enterMotion,
    showToastFallback,
  }
}
