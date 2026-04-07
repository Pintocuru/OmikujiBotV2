<template>
  <div class="relative" :class="[sizeClass, round && 'rounded-full', border && 'border']">
    <div
      v-if="sources.length"
      :key="animationKey"
      ref="motionTarget"
      class="w-full h-full relative"
      :class="cssAnimationClass"
      :style="cssAnimationStyle"
    >
      <template v-for="(src, i) in sources" :key="i">
        <video
          v-if="isVideo(src)"
          :src="src"
          autoplay
          :loop="animation?.loop ?? true"
          muted
          playsinline
          class="absolute inset-0 object-contain w-full h-full"
          :style="{ zIndex: sources.length - i }"
          @error="onError(i)"
        />
        <img
          v-else
          :src="src"
          class="absolute inset-0 object-contain w-full h-full"
          :style="{ zIndex: sources.length - i }"
          @error="onError(i)"
        />
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed, ref, watch } from 'vue'
  import { useMotion } from '@vueuse/motion'
  import { CharacterAnimationType, getImagePath } from '@/types/'
  import { loopMotionMap } from '@/types/MetaMaps/loopMotionMaps'
  import 'animate.css'

  const props = defineProps<{
    layers: string[] | string
    size?: number
    round?: boolean
    border?: boolean
    animation?: CharacterAnimationType
  }>()

  const errorIndexes = ref(new Set<number>())
  const motionTarget = ref<HTMLElement | null>(null)

  const isVideo = (src: string) => /\.(webm|mp4)$/i.test(src)

  const rawLayers = computed(() => (typeof props.layers === 'string' ? [props.layers] : props.layers))

  const sources = computed(() =>
    rawLayers.value
      .map((l, i) => ({ l, i }))
      .filter(({ l, i }) => l && !errorIndexes.value.has(i))
      .map(({ l }) => getImagePath(l))
  )

  const onError = (index: number) => errorIndexes.value.add(index)

  const sizeClass = computed(() => `w-${props.size || 16} h-${props.size || 16}`)

  const animationKey = computed(() => `${props.animation?.type}-${props.animation?.duration}-${props.animation?.loop}`)

  // ─── Motion系 ──────────────────────────────────
  const motionVariant = computed(() => {
    if (!props.animation || props.animation.type === 'none') return null
    const entry = loopMotionMap[props.animation.type]
    if (!entry || entry.kind !== 'motion') return null

    const duration = (props.animation.duration ?? 1.5) * 1000
    const variant = entry.variant as { initial: object; visible: { transition?: Record<string, unknown> } }
    return {
      initial: variant.initial,
      visible: {
        ...variant.visible,
        transition: {
          ...variant.visible?.transition,
          duration,
          repeat: props.animation.loop ? Infinity : 0,
        },
      },
    }
  })

  useMotion(
    motionTarget,
    computed(() => motionVariant.value ?? { initial: {}, visible: {} })
  )

  // ─── CSS系 ─────────────────────────────────────
  const cssAnimationClass = computed(() => {
    if (!props.animation || props.animation.type === 'none') return ''
    const entry = loopMotionMap[props.animation.type]
    if (!entry || entry.kind !== 'css') return ''
    const classes = ['animate__animated', entry.variant as string]
    if (props.animation.loop) classes.push('animate__infinite')
    return classes.join(' ')
  })

  const cssAnimationStyle = computed(() => {
    if (!props.animation || props.animation.type === 'none') return {}
    const entry = loopMotionMap[props.animation.type]
    if (!entry || entry.kind !== 'css') return {}
    return {
      '--animate-duration': `${props.animation.duration ?? 1.5}s`,
      '--animate-iteration-count': props.animation.loop ? 'infinite' : '1',
    }
  })

  watch(
    () => rawLayers.value,
    () => errorIndexes.value.clear(),
    { deep: true }
  )
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
