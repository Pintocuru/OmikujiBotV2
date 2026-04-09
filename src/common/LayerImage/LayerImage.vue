<!-- src/common/LayerImage/LayerImage.vue -->
<template>
  <div class="relative" :class="[sizeClass, round && 'rounded-full', border && 'border']">
    <div
      v-if="sources.length"
      :key="animationKey"
      class="w-full h-full relative animate__animated"
      :class="animationClass"
      :style="animationStyle"
    >
      <div v-for="(src, i) in sources" :key="i" class="absolute inset-0" :style="{ zIndex: sources.length - i }">
        <CharacterLayer :src="src" :loop="animation?.loop ?? true" @error="onError(i)" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import CharacterLayer from './CharacterLayer.vue'
  import { useImageSources } from './useImageSources'
  import { loopMotionMap } from '@/types/MetaMaps/loopMotionMaps'
  import type { CharacterAnimationType } from '@/types/'
  import 'animate.css'
  import './animations.css'

  const props = defineProps<{
    layers: string[] | string
    size?: number
    round?: boolean
    border?: boolean
    animation?: CharacterAnimationType
  }>()

  const sizeClass = computed(() => `w-${props.size || 16} h-${props.size || 16}`)
  const { sources, onError } = useImageSources(() => props.layers)

  const animationKey = computed(() => `${props.animation?.type}-${props.animation?.duration}-${props.animation?.loop}`)

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
