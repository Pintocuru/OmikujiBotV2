<!-- src\MainGenerator\scripts\MotionVariants\MotionWrapper.vue -->
<template>
  <Transition :css="false" @leave="onLeave">
    <div
      v-if="visible"
      ref="motionElement"
      v-motion="motionKey"
      :initial="motionVariant.initial"
      :enter="motionVariant.enter"
      :leave="motionVariant.leave"
      v-bind="$attrs"
    >
      <slot />
    </div>
  </Transition>
</template>

<script setup lang="ts">
  import { computed, watch, onMounted, onBeforeUnmount, nextTick, toRef } from 'vue'
  import { MotionType } from './MotionVariants'
  import { useMotionAnimation } from './useMotionAnimation.ts'

  // Props定義
  const props = withDefaults(
    defineProps<{
      visible?: boolean
      motion?: MotionType
      motionKey?: string
      autoHide?: boolean
      hideDelay?: number
    }>(),
    {
      visible: true,
      motion: 'none',
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

  // コンポーザブルの使用
  const motionRef = computed(() => props.motion)
  const visibleRef = toRef(props, 'visible')

  const {
    motionElement,
    motionVariant,
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
    visible: visibleRef,
    autoHide: props.autoHide,
    hideDelay: props.hideDelay,
    emit,
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
