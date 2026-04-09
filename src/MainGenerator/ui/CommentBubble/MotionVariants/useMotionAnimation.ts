// src/MainGenerator/ui/CommentBubble/MotionVariants/useMotionAnimation.ts
import { computed, nextTick, Ref, ComputedRef, onUnmounted } from 'vue'
import { enterMotionMap } from '@/types/MetaMaps/enterMotionMaps'
import { EnterMotionType } from '@/types'

export interface MotionAnimationEmits {
  'update:visible': [value: boolean]
  'enter-start': []
  'enter-complete': []
  'leave-start': []
  'leave-complete': []
}

export interface UseMotionAnimationOptions {
  motion: ComputedRef<EnterMotionType>
  leaveMotion?: ComputedRef<EnterMotionType | undefined>
  visible: Ref<boolean>
  autoHide: boolean
  hideDelay: number
  emit: (event: keyof MotionAnimationEmits, ...args: any[]) => void
}

export function useMotionAnimation(options: UseMotionAnimationOptions) {
  const { motion, leaveMotion, visible, autoHide, hideDelay, emit } = options

  let autoHideTimer: ReturnType<typeof setTimeout> | null = null

  const motionConfig = computed(() => enterMotionMap[motion.value])
  const leaveConfig = computed(() => {
    const target = leaveMotion?.value ?? motion.value
    return enterMotionMap[target]
  })

  // --- タイマー関連 ---
  const clearAutoHideTimer = () => {
    if (autoHideTimer) {
      clearTimeout(autoHideTimer)
      autoHideTimer = null
    }
  }

  const setAutoHideTimer = () => {
    clearAutoHideTimer()
    if (autoHide && visible.value) {
      autoHideTimer = setTimeout(() => hide(), hideDelay)
    }
  }

  // --- Transition Hooks ---

  // Transitionの @before-enter または @enter で呼ぶ
  const onBeforeEnter = (el: Element) => {
    emit('enter-start')
    const htmlEl = el as HTMLElement
    // 初期状態 (opacity-0等) があれば付与
    if (motionConfig.value.initial) {
      htmlEl.classList.add(...motionConfig.value.initial.split(' '))
    }
  }

  const onEnter = (el: Element, done: () => void) => {
    const htmlEl = el as HTMLElement

    // initialクラスを削除してアニメーション開始
    if (motionConfig.value.initial) {
      htmlEl.classList.remove(...motionConfig.value.initial.split(' '))
    }

    if (motion.value === 'none') {
      done()
      return
    }

    executeAnimation(htmlEl, motionConfig.value.enter, done)
  }

  const onAfterEnter = () => {
    emit('enter-complete')
    setAutoHideTimer()
  }

  const onLeave = (el: Element, done: () => void) => {
    clearAutoHideTimer()
    emit('leave-start')

    const htmlEl = el as HTMLElement
    if (motion.value === 'none' || !leaveConfig.value.leave) {
      done()
      return
    }

    executeAnimation(htmlEl, leaveConfig.value.leave, done)
  }

  const onAfterLeave = () => {
    emit('leave-complete')
  }

  // アニメーション実行の共通処理
  const executeAnimation = (el: HTMLElement, animationClass: string, done: () => void) => {
    const onAnimationEnd = (e: AnimationEvent) => {
      if (e.target !== el) return
      el.removeEventListener('animationend', onAnimationEnd)
      // アニメーションクラスをクリーンアップ
      el.classList.remove('animate__animated', ...animationClass.split(' '))
      done()
    }

    el.addEventListener('animationend', onAnimationEnd)
    el.classList.add('animate__animated', ...animationClass.split(' '))
  }

  // --- 操作用関数 ---
  const show = () => emit('update:visible', true)
  const hide = () => emit('update:visible', false)
  const toggle = () => (visible.value ? hide() : show())

  const reload = async () => {
    hide()
    await nextTick()
    show()
  }

  onUnmounted(() => clearAutoHideTimer())

  return {
    motionConfig,
    leaveConfig,
    onBeforeEnter,
    onEnter,
    onAfterEnter,
    onLeave,
    onAfterLeave,
    show,
    hide,
    toggle,
    reload,
  }
}
