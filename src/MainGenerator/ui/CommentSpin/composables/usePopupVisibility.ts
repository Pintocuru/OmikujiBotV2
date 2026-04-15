// src/MainGenerator/ui/CommentSpin/composables/usePopupVisibility.ts
import { ref, watch } from 'vue'
import type { BotMessageBubbleType } from '@/types'

const DISPLAY_DURATION_MS = 10_000

export function usePopupVisibility(options: {
  isSpinning: () => boolean
  resolvedMessage: () => BotMessageBubbleType | null
}) {
  const isVisible = ref(false)
  let hideTimer: ReturnType<typeof setTimeout> | null = null

  const clearTimer = () => {
    if (hideTimer !== null) {
      clearTimeout(hideTimer)
      hideTimer = null
    }
  }

  // 回転開始で表示
  watch(options.isSpinning, (spinning) => {
    if (spinning) {
      clearTimer()
      isVisible.value = true
    }
  })

  // 確定表示後、10秒で非表示
  watch(options.resolvedMessage, (msg) => {
    if (msg) {
      clearTimer()
      hideTimer = setTimeout(() => {
        isVisible.value = false
        hideTimer = null
      }, DISPLAY_DURATION_MS)
    }
  })

  return { isVisible }
}
