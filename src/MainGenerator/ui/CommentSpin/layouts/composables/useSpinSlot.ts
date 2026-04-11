// src/MainGenerator/ui/CommentSpin/layouts/composables/useSpinSlot.ts
import { ref, computed, watch, nextTick, onUnmounted } from 'vue'
import type { BotMessageBubbleType, spinAnimation } from '@/types'

interface SpinSlotOptions {
  isSpinning: () => boolean
  resolvedMessage: () => BotMessageBubbleType | null
  size: () => { width: number; height: number }
  animation: () => spinAnimation
  slotMessages?: () => BotMessageBubbleType[] // flipLoop 用（flip/calendar のみ使用）
  emit: (event: 'animation-ready', el: HTMLElement, itemSize: number) => void
}

export function useSpinSlot({ isSpinning, resolvedMessage, size, animation, slotMessages, emit }: SpinSlotOptions) {
  const slotTrackRef = ref<HTMLElement | null>(null)
  const resolvedRef = ref<HTMLElement | null>(null)

  // ── scroll/horizontal 用 ──────────────────────────────
  const trackClass = computed(() => (animation() === 'horizontal' ? 'flex flex-row h-full' : 'flex flex-col w-full'))

  const itemStyle = computed(() => {
    const { width, height } = size()
    return animation() === 'horizontal'
      ? { width: `${width}px`, height: '100%' }
      : { height: `${height}px`, width: '100%' }
  })

  const itemSize = computed(() => (animation() === 'horizontal' ? size().width : size().height))

  // ── flipLoop 用（flip/calendar のみ） ─────────────────
  const currentIndex = ref(0)
  const isFlipping = ref(false)
  let flipInterval: ReturnType<typeof setInterval> | null = null

  const isFlipMode = computed(() => {
    const a = animation()
    return a === 'flip' || a === 'calendar'
  })

  function startFlipLoop() {
    currentIndex.value = 0
    isFlipping.value = false
    const isCalendar = animation() === 'calendar'

    flipInterval = setInterval(
      () => {
        isFlipping.value = true
        setTimeout(
          () => {
            const msgs = slotMessages?.() ?? []
            currentIndex.value = (currentIndex.value + 1) % (msgs.length || 1)
            isFlipping.value = false
          },
          isCalendar ? 200 : 250
        )
      },
      isCalendar ? 400 : 500
    )
  }

  function stopFlipLoop() {
    if (flipInterval) {
      clearInterval(flipInterval)
      flipInterval = null
    }
    isFlipping.value = false
  }

  onUnmounted(stopFlipLoop)

  // ── isSpinning watch ──────────────────────────────────
  watch(isSpinning, async (val) => {
    if (!val) {
      stopFlipLoop()
      return
    }
    await nextTick()

    if (isFlipMode.value) {
      startFlipLoop()
      // AnimationController との互換のため dummy emit
      const dummyEl = document.createElement('div')
      emit('animation-ready', dummyEl, size().height)
    } else {
      if (slotTrackRef.value) {
        emit('animation-ready', slotTrackRef.value, itemSize.value)
      }
    }
  })

  // ── resolvedMessage watch（共通） ─────────────────────
  watch([isSpinning, resolvedMessage], async ([spinning, msg]) => {
    if (spinning || !msg) return
    await nextTick()
    if (!resolvedRef.value) return

    // 停止時のアニメーション
    resolvedRef.value.animate(
      [
        { opacity: '0', transform: 'scale(0.95)' },
        { opacity: '1', transform: 'scale(1)' },
      ],
      { duration: 300, easing: 'ease-out', fill: 'forwards' }
    )
  })

  return {
    // scroll/horizontal 用
    slotTrackRef,
    trackClass,
    itemStyle,
    // flip/calendar 用
    currentIndex,
    isFlipping,
    // 共通
    resolvedRef,
  }
}
