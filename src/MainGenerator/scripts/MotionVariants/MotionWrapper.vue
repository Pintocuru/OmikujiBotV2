<!-- src/components/common/MotionWrapper.vue -->
<template>
  <Transition :css="false" @leave="onLeave">
    <div
      v-if="visible"
      ref="motionElement"
      v-motion="motionKey"
      :initial="initialVariant.initial"
      :enter="enterVariant.enter"
      :leave="leaveVariant.leave"
      v-bind="$attrs"
    >
      <slot />
    </div>
  </Transition>
</template>

<script setup lang="ts">
  import { ref, computed, nextTick, watch, onMounted, onBeforeUnmount } from 'vue'
  import { MotionVariants, useMotion } from '@vueuse/motion'
  import { LoopMotionType, loopMotionVariants, MotionType, motionVariants } from './MotionVariants'

  // Props定義
  // TODO: v2.0でLoopMotionType も許可したい
  const props = withDefaults(
    defineProps<{
      visible?: boolean
      initialMotion?: MotionType
      enterMotion?: MotionType
      leaveMotion?: MotionType
      motionKey?: string
      autoHide?: boolean
      hideDelay?: number
    }>(),
    {
      visible: true,
      initialMotion: 'none',
      enterMotion: 'none',
      leaveMotion: 'none',
      motionKey: 'motion',
      autoHide: false,
      hideDelay: 3000,
    }
  )

  // Emits定義
  const emit = defineEmits<{
    'update:visible': [value: boolean]
    'enter-start': []
    'enter-complete': []
    'leave-start': []
    'leave-complete': []
  }>()

  // アニメーション設定の算出
  const initialVariant = computed(() => motionVariants[props.initialMotion])
  const enterVariant = computed(() => motionVariants[props.enterMotion])
  const leaveVariant = computed(() => motionVariants[props.leaveMotion])

  // 要素の参照
  const motionElement = ref<HTMLElement>()

  // Motion Instanceの管理
  let motionInstance: ReturnType<typeof useMotion> | null = null
  let autoHideTimer: number | null = null

  // Motion Instanceを初期化する関数
  const initializeMotion = () => {
    if (motionElement.value) {
      motionInstance = useMotion(motionElement.value, {
        initial: initialVariant.value.initial,
        enter: enterVariant.value.enter,
        leave: leaveVariant.value.leave,
      } as MotionVariants<string>)
    }
  }

  // 自動非表示のタイマーを設定
  const setAutoHideTimer = () => {
    if (props.autoHide && props.visible) {
      clearAutoHideTimer()
      autoHideTimer = window.setTimeout(() => {
        hide()
      }, props.hideDelay)
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

  // 外部から呼び出し可能な関数群
  const show = async () => {
    emit('update:visible', true)
    await nextTick()
    initializeMotion()
    emit('enter-start')

    // enterアニメーション完了を待つ
    try {
      if (motionInstance?.apply) {
        await motionInstance.apply('enter')
      }
      emit('enter-complete')
      setAutoHideTimer()
    } catch (error) {
      console.warn('Enter animation failed:', error)
      emit('enter-complete')
      setAutoHideTimer()
    }
  }

  const hide = async () => {
    if (props.visible && motionInstance?.apply) {
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

  const toggle = async () => {
    if (props.visible) {
      await hide()
    } else {
      await show()
    }
  }

  const reload = async () => {
    if (props.visible) {
      emit('update:visible', false)
      await nextTick()
      await show()
    } else {
      emit('update:visible', true)
    }
  }

  // アニメーション設定の変更を監視
  watch([() => props.initialMotion, () => props.leaveMotion], async () => {
    if (props.visible) {
      emit('update:visible', false)
      await nextTick()
      await show()
    }
  })

  // visibleの変更を監視
  watch(
    () => props.visible,
    async (newVisible) => {
      if (newVisible) {
        await nextTick()
        initializeMotion()
        setAutoHideTimer()
      } else {
        clearAutoHideTimer()
      }
    }
  )

  // コンポーネントマウント時の初期化
  onMounted(() => {
    if (props.visible) {
      nextTick(() => {
        initializeMotion()
        setAutoHideTimer()
      })
    }
  })

  // コンポーネント破棄時のクリーンアップ
  onBeforeUnmount(() => {
    clearAutoHideTimer()
  })

  // 外部から呼び出し可能な関数を公開
  defineExpose({
    show,
    hide,
    toggle,
    reload,
  })
</script>
