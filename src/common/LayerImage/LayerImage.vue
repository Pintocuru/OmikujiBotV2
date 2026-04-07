<template>
  <div class="relative" :class="[sizeClass, round && 'rounded-full', border && 'border']">
    <div
      v-if="sources.length"
      :key="animationClass"
      class="animate__animated"
      :class="[animationClass, 'w-full h-full relative']"
      :style="animationStyle"
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
  import { CharacterAnimationType, getImagePath } from '@/types/'
  import 'animate.css'

  const props = defineProps<{
    layers: string[] | string
    size?: number
    round?: boolean
    border?: boolean
    animation?: CharacterAnimationType
  }>()

  const errorIndexes = ref(new Set<number>())

  const isVideo = (src: string) => {
    return /\.(webm|mp4)$/i.test(src)
  }

  const rawLayers = computed(() => (typeof props.layers === 'string' ? [props.layers] : props.layers))

  const sources = computed(() =>
    rawLayers.value
      .map((l, i) => ({ l, i }))
      .filter(({ l, i }) => l && !errorIndexes.value.has(i))
      .map(({ l }) => getImagePath(l))
  )

  const onError = (index: number) => {
    errorIndexes.value.add(index)
  }

  const sizeClass = computed(() => `w-${props.size || 16} h-${props.size || 16}`)

  // Animate.cssのクラス名を生成（修正版）
  const animationClass = computed(() => {
    if (!props.animation || props.animation.type === 'none') return ''

    const { type, loop } = props.animation
    const classes = ['animate__animated', `animate__${type}`]

    // 無限ループの設定
    if (loop) classes.push('animate__infinite')

    return classes.join(' ')
  })

  // durationをCSS変数で指定
  const animationStyle = computed(() => {
    if (!props.animation || props.animation.type === 'none') return {}

    const duration = props.animation.duration || 1
    // loop が true なら infinite、false なら 1
    const iterationCount = props.animation.loop ? 'infinite' : '1'

    return {
      '--animate-duration': `${duration}s`,
      '--animate-iteration-count': iterationCount, // 追加
      '--animate-delay': '0s',
    }
  })

  watch(
    () => rawLayers.value,
    () => {
      errorIndexes.value.clear()
    },
    { deep: true }
  )
</script>

<style scoped>
  /* ユーザーが「動きを減らす」設定にしていても、propsの指定を優先して動かす設定 */
  @media (prefers-reduced-motion: reduce) {
    .animate__animated {
      /* CSS変数から値を取得し、!important で強制上書きする */
      animation-duration: var(--animate-duration) !important;
      animation-iteration-count: var(--animate-iteration-count) !important;
      transition-duration: var(--animate-duration) !important;
    }
  }
</style>
