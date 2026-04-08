import { ref, nextTick, Ref } from 'vue'
import type { BotMessageBubbleType, spinAnimation } from '@/types'

interface AnimationOptions {
  duration?: number
  easing?: string
  type?: Ref<spinAnimation>
}

export function useCommentSpinAnimation(options: AnimationOptions = {}) {
  const { duration = 1500, easing = 'cubic-bezier(0.25, 0.1, 0.1, 1)' } = options
  const animationType = options.type?.value ?? 'vertical'

  const slotMessages = ref<BotMessageBubbleType[]>([])
  const isSpinning = ref(false)
  const resolvedMessage = ref<BotMessageBubbleType | null>(null)

  async function startSpin(msgs: BotMessageBubbleType[]) {
    if (isSpinning.value) return

    isSpinning.value = false
    slotMessages.value = []
    resolvedMessage.value = null

    await nextTick()

    slotMessages.value = msgs
    isSpinning.value = true
  }

  /**
   * アニメーション実行
   */
  async function onAnimationReady(el: HTMLElement, itemSize: number) {
    let anim: Animation | null = null
    switch (animationType) {
      case 'vertical':
        anim = verticalSpin(el, itemSize)
        break
      case 'horizontal':
        anim = horizontalSpin(el, itemSize)
        break
      case 'flip':
        anim = flipSpin(el)
        break
      case 'calendar':
        anim = calendarSpin(el, itemSize)
        break
    }

    if (!anim) return

    anim.onfinish = () => {
      const last = slotMessages.value[slotMessages.value.length - 1]
      if (last) resolvedMessage.value = last

      // displaySeconds を取得（null/undefined の場合は 0）
      const delayMs = (resolvedMessage.value?.bubble.displaySeconds ?? 0) * 1000

      setTimeout(() => {
        isSpinning.value = false
      }, delayMs)
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

  // =========================
  // 各アニメーション実装
  // =========================

  function verticalSpin(el: HTMLElement, itemHeight: number) {
    const targetY = -((slotMessages.value.length - 1) * itemHeight)

    return el.animate([{ transform: 'translateY(0)' }, { transform: `translateY(${targetY}px)` }], {
      duration,
      easing,
      fill: 'forwards',
    })
  }

  function horizontalSpin(el: HTMLElement, itemWidth: number) {
    const targetX = -((slotMessages.value.length - 1) * itemWidth)

    return el.animate([{ transform: 'translateX(0)' }, { transform: `translateX(${targetX}px)` }], {
      duration,
      easing,
      fill: 'forwards',
    })
  }

  function flipSpin(el: HTMLElement) {
    return el.animate([{ transform: 'rotateX(0deg)' }, { transform: 'rotateX(720deg)' }], {
      duration,
      easing: 'ease-in-out',
      fill: 'forwards',
    })
  }

  function calendarSpin(el: HTMLElement, itemHeight: number) {
    const steps = slotMessages.value.length
    const stepDuration = duration / steps

    let current = 0

    const animateStep = () => {
      if (current >= steps - 1) return

      const from = -current * itemHeight
      const to = -(current + 1) * itemHeight

      el.animate([{ transform: `translateY(${from}px)` }, { transform: `translateY(${to}px)` }], {
        duration: stepDuration,
        easing: 'ease-in-out',
        fill: 'forwards',
      })

      current++
      setTimeout(animateStep, stepDuration * 0.9)
    }

    animateStep()

    // 擬似Animation返却（finish制御用）
    return {
      onfinish: null as any,
    } as Animation
  }
}
