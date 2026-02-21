<!-- src/MainGenerator/scripts/MotionVariants/MotionWrapper.vue -->
<template>
  <Transition :css="false" @leave="onLeave">
    <div
      v-if="visible"
      ref="motionElement"
      v-motion="motionKey"
      :initial="motionVariant.initial"
      :enter="motionVariant.enter"
      :leave="leaveMotionVariant.leave"
      v-bind="$attrs"
    >
      <slot />
    </div>
  </Transition>
</template>

<script setup lang="ts">
  import { computed, watch, onMounted, onBeforeUnmount, nextTick, toRef } from 'vue'
  import { EnterMotionType } from './MotionVariants'
  import { useMotionAnimation, MotionAnimationEmits } from './useMotionAnimation'

  // Props定義
  const props = withDefaults(
    defineProps<{
      visible?: boolean
      motion: EnterMotionType
      leaveMotion?: EnterMotionType
      motionKey?: string
      autoHide?: boolean
      hideDelay?: number
    }>(),
    {
      visible: true,
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

  // emit関数のラッパー (型エラー回避)
  const emitWrapper = (event: keyof MotionAnimationEmits, ...args: any[]) => {
    if (event === 'update:visible') {
      emit('update:visible', args[0] as boolean)
    } else if (event === 'enter-start') {
      emit('enter-start')
    } else if (event === 'enter-complete') {
      emit('enter-complete')
    } else if (event === 'leave-start') {
      emit('leave-start')
    } else if (event === 'leave-complete') {
      emit('leave-complete')
    }
  }

  // コンポーザブルの使用
  const motionRef = computed(() => props.motion)
  const leaveMotionRef = computed(() => props.leaveMotion)
  const visibleRef = toRef(props, 'visible')

  const {
    motionElement,
    motionVariant,
    leaveMotionVariant,
    initializeMotion,
    setAutoHideTimer,
    clearAutoHideTimer,
    onLeave,
    show,
    hide,
    toggle,
    reload,
  } = useMotionAnimation({
    motion: motionRef,
    leaveMotion: leaveMotionRef,
    visible: visibleRef,
    autoHide: props.autoHide,
    hideDelay: props.hideDelay,
    emit: emitWrapper,
  })

  // アニメーション設定の変更を監視
  watch(
    () => props.motion,
    async () => {
      if (props.visible) {
        emit('update:visible', false)
        await nextTick()
        await show()
      }
    }
  )

  // leaveMotionの変更も監視 (必要に応じて)
  watch(
    () => props.leaveMotion,
    async () => {
      if (props.visible) {
        // leaveMotionが変更されたら、次回の非表示時に反映される
        initializeMotion()
      }
    }
  )

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
