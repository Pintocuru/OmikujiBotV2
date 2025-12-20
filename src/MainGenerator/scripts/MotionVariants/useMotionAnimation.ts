// C:\_root\_nodejs\OmikenTemplates\templates\OmikujiBot\src\MainGenerator\scripts\MotionVariants\useMotionAnimation.ts
import { ref, computed, nextTick, Ref, ComputedRef } from 'vue'
import { MotionVariants, useMotion } from '@vueuse/motion'
import { MotionType, motionVariants } from './MotionVariants'

export interface MotionAnimationEmits {
  'update:visible': [value: boolean]
  'enter-start': []
  'enter-complete': []
  'leave-start': []
  'leave-complete': []
}

export interface UseMotionAnimationOptions {
  motion: ComputedRef<MotionType>
  leaveMotion?: ComputedRef<MotionType | undefined> // undefined を許容
  visible: Ref<boolean>
  autoHide: boolean
  hideDelay: number
  emit: (event: keyof MotionAnimationEmits, ...args: any[]) => void
}

export function useMotionAnimation(options: UseMotionAnimationOptions) {
  const { motion, leaveMotion, visible, autoHide, hideDelay, emit } = options

  // 要素の参照
  const motionElement = ref<HTMLElement>()

  // Motion Instanceの管理
  let motionInstance: ReturnType<typeof useMotion> | null = null
  let autoHideTimer: number | null = null

  // アニメーション設定の算出
  const motionVariant = computed(() => motionVariants[motion.value])

  // Leave用のモーション設定 (leaveMotionが指定されていればそれを使用)
  const leaveMotionVariant = computed(() => {
    const targetMotion = leaveMotion?.value ?? motion.value
    return motionVariants[targetMotion]
  })

  // Motion Instanceを初期化する関数
  const initializeMotion = () => {
    if (motionElement.value) {
      motionInstance = useMotion(motionElement.value, {
        initial: motionVariant.value.initial,
        enter: motionVariant.value.enter,
        leave: leaveMotionVariant.value.leave, // leave は leaveMotionVariant を使用
      } as MotionVariants<string>)
    }
  }

  // 自動非表示のタイマーを設定
  const setAutoHideTimer = () => {
    if (autoHide && visible.value) {
      clearAutoHideTimer()
      autoHideTimer = window.setTimeout(() => {
        hide()
      }, hideDelay)
    }
  }

  // 自動非表示のタイマーをクリア
  const clearAutoHideTimer = () => {
    if (autoHideTimer) {
      clearTimeout(autoHideTimer)
      autoHideTimer = null
    }
  }

  // Transitionのleaveイベントハンドラー
  const onLeave = async (el: Element, done: () => void) => {
    emit('leave-start')
    try {
      if (motionInstance?.apply) {
        await motionInstance.apply('leave')
      }
      emit('leave-complete')
      done()
    } catch (error) {
      console.warn('Leave animation failed:', error)
      emit('leave-complete')
      done()
    }
  }

  // 表示処理
  const show = async () => {
    emit('update:visible', true)
    await nextTick()
    initializeMotion()
    emit('enter-start')

    const shouldSkipEnterAnimation = motion.value === 'none'

    try {
      if (motionInstance?.apply && !shouldSkipEnterAnimation) {
        await motionInstance.apply('enter')
      } else if (motionInstance?.set && shouldSkipEnterAnimation) {
        motionInstance.set(motionVariant.value.enter ?? 'none')
      }

      emit('enter-complete')
      setAutoHideTimer()
    } catch (error) {
      console.warn('Enter animation failed:', error)

      if (motionInstance?.set) {
        motionInstance.set(motionVariant.value.enter ?? 'none')
      }

      emit('enter-complete')
      setAutoHideTimer()
    }
  }

  // 非表示処理
  const hide = async () => {
    if (visible.value && motionInstance?.apply) {
      clearAutoHideTimer()
      emit('leave-start')
      try {
        await motionInstance.apply('leave')
        emit('update:visible', false)
        emit('leave-complete')
      } catch (error) {
        console.warn('Hide animation failed:', error)
        emit('update:visible', false)
        emit('leave-complete')
      }
    }
  }

  // トグル処理
  const toggle = async () => {
    if (visible.value) {
      await hide()
    } else {
      await show()
    }
  }

  // リロード処理
  const reload = async () => {
    if (visible.value) {
      emit('update:visible', false)
      await nextTick()
      await show()
    } else {
      emit('update:visible', true)
    }
  }

  return {
    motionElement,
    motionVariant,
    leaveMotionVariant, // 追加
    initializeMotion,
    setAutoHideTimer,
    clearAutoHideTimer,
    onLeave,
    show,
    hide,
    toggle,
    reload,
  }
}
