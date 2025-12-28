// src\MainGenerator\components\CommentBubble\composables\useMessageFilter.ts
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useAppStore } from '@/MainGenerator/stores/useAppStore'
import { useMessageFilterCore } from './useMessageFilterCore'

export const useMessageFilter = () => {
  const appStore = useAppStore()
  const { botMessages, data } = storeToRefs(appStore)

  const showCharacters = computed(() => data.value.components.bubble.showCharacters)

  return useMessageFilterCore(botMessages, showCharacters)
}
