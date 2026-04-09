<!-- src/MainGenerator/ui/CommentBubble/MotionVariants/MotionWrapper.vue -->
<template>
  <Transition
    appear
    :css="false"
    @before-enter="onBeforeEnter"
    @enter="onEnter"
    @after-enter="onAfterEnter"
    @leave="onLeave"
    @after-leave="onAfterLeave"
  >
    <div v-if="visible" ref="motionElement" v-bind="$attrs" :style="animationStyle">
      <slot />
    </div>
  </Transition>
</template>

<script setup lang="ts">
  import { computed, toRef } from 'vue'
  import { useMotionAnimation, MotionAnimationEmits } from './useMotionAnimation'
  import { EnterMotionType } from '@/types'

  const props = withDefaults(
    defineProps<{
      visible?: boolean
      motion: EnterMotionType
      leaveMotion?: EnterMotionType
      autoHide?: boolean
      hideDelay?: number
    }>(),
    {
      visible: true,
      autoHide: false,
      hideDelay: 3000,
    }
  )

  const emit = defineEmits<MotionAnimationEmits>()

  const motion = computed(() => props.motion)

  // コンポーザブル側で期待される emit インターフェースに合わせる
  const emitWrapper = (event: keyof MotionAnimationEmits, ...args: any[]) => {
    ;(emit as any)(event, ...args)
  }

  const { onBeforeEnter, onEnter, onAfterEnter, onLeave, onAfterLeave, show, hide, toggle, reload } =
    useMotionAnimation({
      motion,
      leaveMotion: computed(() => props.leaveMotion),
      visible: toRef(props, 'visible'),
      autoHide: props.autoHide,
      hideDelay: props.hideDelay,
      emit: emitWrapper,
    })

  const animationStyle = computed(() => ({
    '--animate-duration': '1s',
    '--animate-iteration-count': '1',
  }))

  // 外部から呼び出し可能な関数を公開
  defineExpose({
    show,
    hide,
    toggle,
    reload,
  })
</script>

<style scoped>
  /* スタイルは元のままでOK。
   prefers-reduced-motion の上書き設定はアクセシビリティ上の配慮として残すべきです。 */
  @media (prefers-reduced-motion: reduce) {
    .animate__animated {
      animation-duration: var(--animate-duration) !important;
      animation-iteration-count: var(--animate-iteration-count) !important;
      transition-duration: var(--animate-duration) !important;
      animation-fill-mode: both !important;
    }
  }
</style>
