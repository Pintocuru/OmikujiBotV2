<!-- src/common/LayerImage/LayerImage.vue -->
<template>
  <div class="relative grid" :class="[round && 'rounded-full', border && 'border']" :style="containerStyle">
    <div
      v-for="(src, i) in sources"
      :key="i"
      class="col-start-1 row-start-1 animate__animated"
      :class="animationClass"
      :style="{ ...animationStyle, zIndex: sources.length - i }"
    >
      <MediaLayer class="w-full h-full" :src="src" @error="onError(i)" />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { CharacterAnimationType, loopMotionMap } from '@/types'
  import MediaLayer from './MediaLayer.vue'
  import { useImageSources } from './useImageSources'
  import 'animate.css'
  import './animations.css'

  const props = defineProps<{
    layers: string[] | string
    // --- サイズ: size(Tailwind整数) か width/height(px) のどちらか ---
    size?: number // 旧 LayerImage 互換。Tailwind w-N h-N に変換
    width?: number // px 指定（size より優先）
    height?: number
    maxWidth?: number
    minWidth?: number
    round?: boolean
    border?: boolean
    animation?: CharacterAnimationType
  }>()

  const containerStyle = computed(() => {
    // width prop があれば px、なければ size を rem 換算（1単位=0.25rem=4px）
    const w = props.width ? `${props.width}px` : props.size ? `${props.size * 4}px` : '100%'
    const h = props.height ? `${props.height}px` : props.size ? `${props.size * 4}px` : '100%'
    return {
      width: w,
      height: h,
      maxWidth: props.maxWidth ? `${props.maxWidth}px` : undefined,
      minWidth: props.minWidth ? `${props.minWidth}px` : undefined,
    }
  })

  const { sources, onError } = useImageSources(() => props.layers)

  const animationClass = computed(() => {
    const anim = props.animation
    if (!anim || anim.type === 'none') return ''
    const entry = loopMotionMap[anim.type]
    return [entry.variant, anim.loop ? 'animate__infinite' : ''].filter(Boolean).join(' ')
  })

  const animationStyle = computed(() => {
    const anim = props.animation
    if (!anim || anim.type === 'none') return {}
    const duration = `${anim.duration ?? 1.5}s`
    const iteration = anim.loop ? 'infinite' : '1'
    return {
      '--anim-duration': duration,
      '--anim-iteration-count': iteration,
      '--animate-duration': duration,
      '--animate-iteration-count': iteration,
    }
  })
</script>

<style scoped>
  @media (prefers-reduced-motion: reduce) {
    .animate__animated {
      animation-duration: var(--animate-duration) !important;
      animation-iteration-count: var(--animate-iteration-count) !important;
      transition-duration: var(--animate-duration) !important;
    }
  }
</style>
