<!-- src/MainGenerator/ui/FlashBanner/layouts/tweetParts.vue -->
<template>
  <div class="flex flex-col" :class="alignClass">
    <!-- 本体 -->
    <div class="rounded-xl border border-base-content bg-base-100 px-3 py-2 max-w-md">
      <span class="block font-bold text-3xl text-base-content overflow-hidden" :style="clampStyle" v-html="message" />
    </div>

    <!-- 三角（任意） -->
    <div v-if="showTriangle" class="w-6 h-2" :style="triangleStyle">
      <svg width="24" height="8" viewBox="0 0 24 8" xmlns="http://www.w3.org/2000/svg">
        <polygon points="2,0 22,0 12,8" class="fill-base-content/70" style="opacity: 0.7" />
        <polygon points="3,0 21,0 12,7" class="fill-base-100" />
      </svg>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'

  const props = defineProps<{
    message: string
    clampLines?: number
    align?: 'left' | 'right'
    showTriangle?: boolean
    triangleOffset?: string
  }>()

  /**
   * line-clamp を確実に効かせる
   */
  const clampStyle = computed(() => ({
    display: '-webkit-box',
    WebkitLineClamp: props.clampLines ?? 2,
    WebkitBoxOrient: 'vertical' as const,
  }))

  const alignClass = computed(() => (props.align === 'right' ? 'items-end' : 'items-start'))

  const triangleStyle = computed(() => {
    if (!props.triangleOffset) return {}
    return props.align === 'right' ? { marginRight: props.triangleOffset } : { marginLeft: props.triangleOffset }
  })
</script>
