<!-- src/common/LayerImage/LayerImage2.vue -->
<template>
  <div class="relative grid" :class="[round && 'rounded-full', border && 'border']" :style="containerStyle">
    <div
      v-for="(src, i) in sources"
      :key="i"
      class="col-start-1 row-start-1 relative animate__animated"
      :class="animationClass"
      :style="{ ...animationStyle, zIndex: sources.length - i }"
    >
      <CharacterLayer class="w-full h-auto block" :src="src" :loop="animation?.loop ?? true" @error="onError(i)" />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import CharacterLayer from './CharacterLayer.vue'
  import { useImageSources } from './useImageSources'
  import type { CharacterAnimationType } from '@/types/'
  import 'animate.css'
  import './animations.css'
  import { loopMotionMap } from '@/types/MetaMaps/loopMotionMaps'

  const props = defineProps<{
    layers: string[] | string
    width?: number // 指定なければ100%
    maxWidth?: number // オプション
    minWidth?: number // オプション
    round?: boolean
    border?: boolean
    animation?: CharacterAnimationType
  }>()

  const containerStyle = computed(() => ({
    width: props.width ? `${props.width}px` : '100%',
    maxWidth: props.maxWidth ? `${props.maxWidth}px` : undefined,
    minWidth: props.minWidth ? `${props.minWidth}px` : undefined,
  }))

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
      // 自作CSS用 (animations.css)
      '--anim-duration': duration,
      '--anim-iteration-count': iteration,

      // animate.css 標準用 (bounce 等に必要)
      '--animate-duration': duration,
      '--animate-iteration-count': iteration, // ←ここを "anim" ではなく "animate" にする
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
