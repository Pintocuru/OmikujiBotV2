// src/MainGenerator/ui/CommentSpin/layouts/composables/useSpinSlot.ts
import { ref, computed, watch, nextTick } from 'vue'
import type { BotMessageBubbleType, spinAnimation } from '@/types'

interface SpinSlotOptions {
  isSpinning: () => boolean
  resolvedMessage: () => BotMessageBubbleType | null
  size: () => { width: number; height: number }
  animation: () => spinAnimation
  emit: (event: 'animation-ready', el: HTMLElement, itemSize: number) => void
}

export function useSpinSlot({ isSpinning, resolvedMessage, size, animation, emit }: SpinSlotOptions) {
  const slotTrackRef = ref<HTMLElement | null>(null)
  const resolvedRef = ref<HTMLElement | null>(null)

  // 横回転か縦回転かに応じたトラック方向クラス
  const trackClass = computed(() => (animation() === 'horizontal' ? 'flex flex-row h-full' : 'flex flex-col w-full'))

  // 各アイテムのスタイル（横回転: 幅固定, 縦回転: 高さ固定）
  const itemStyle = computed(() => {
    const { width, height } = size()
    return animation() === 'horizontal'
      ? { width: `${width}px`, height: '100%' }
      : { height: `${height}px`, width: '100%' }
  })

  // animation-ready の emit に渡すアイテムサイズ
  const itemSize = computed(() => (animation() === 'horizontal' ? size().width : size().height))

  // スピン開始時に animation-ready を emit
  watch(isSpinning, async (val) => {
    if (!val) return
    await nextTick()
    if (slotTrackRef.value) {
      emit('animation-ready', slotTrackRef.value, itemSize.value)
    }
  })

  // 確定時のフェードインアニメーション
  watch(resolvedMessage, async () => {
    await nextTick()
    if (!resolvedRef.value) return
    resolvedRef.value.animate(
      [
        { opacity: '0', transform: 'scale(0.85)' },
        { opacity: '1', transform: 'scale(1)' },
      ],
      { duration: 300, easing: 'ease-out', fill: 'forwards' }
    )
  })

  return {
    slotTrackRef,
    resolvedRef,
    trackClass,
    itemStyle,
  }
}
