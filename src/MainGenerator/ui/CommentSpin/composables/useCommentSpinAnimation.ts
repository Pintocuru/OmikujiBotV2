// src/MainGenerator/ui/CommentSpin/composables/useCommentSpinAnimation.ts
import { ref, nextTick } from 'vue'
import type { BotMessageBubbleType } from '@/types'

interface AnimationOptions {
  duration?: number
  easing?: string
}

export function useCommentSpinAnimation(options: AnimationOptions = {}) {
  const { duration = 1400, easing = 'cubic-bezier(0.25, 0.1, 0.1, 1)' } = options

  const slotMessages = ref<BotMessageBubbleType[]>([])
  const isSpinning = ref(false)
  const resolvedMessage = ref<BotMessageBubbleType | null>(null)

  /** useCommentSpinMessages の onReady から呼ぶ */
  async function startSpin(msgs: BotMessageBubbleType[]) {
    if (isSpinning.value) return

    isSpinning.value = false
    slotMessages.value = []
    await nextTick()

    slotMessages.value = msgs
    isSpinning.value = true
  }

  /** CommentSpinSelector から animation-ready イベントで受け取った el を渡す */
  async function onAnimationReady(el: HTMLElement, itemHeight: number) {
    const targetY = -((slotMessages.value.length - 1) * itemHeight)

    const anim = el.animate([{ transform: 'translateY(0)' }, { transform: `translateY(${targetY}px)` }], {
      duration,
      easing,
      fill: 'forwards',
    })

    anim.onfinish = () => {
      isSpinning.value = false
      const last = slotMessages.value[slotMessages.value.length - 1]
      if (last) resolvedMessage.value = last
    }
  }

  function onAnimationEnd() {
    // 拡張用
  }

  return {
    slotMessages,
    isSpinning,
    resolvedMessage,
    startSpin,
    onAnimationReady,
    onAnimationEnd,
  }
}
