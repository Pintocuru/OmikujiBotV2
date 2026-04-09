<!-- src/MainGenerator/ui/CommentSpin/layouts/StandardMessage.vue -->
<template>
  <div
    class="font-bold tracking-widest text-base-content text-center leading-tight overflow-hidden break-words"
    :style="{
      fontSize: `${fontSize}px`,
      display: '-webkit-box',
      WebkitLineClamp: 3,
      WebkitBoxOrient: 'vertical',
    }"
  >
    {{ message }}
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'

  const props = defineProps<{
    message: string
  }>()

  /**
   * 長文対応フォントサイズ（段階制）
   */
  const fontSize = computed(() => {
    const len = props.message.length

    if (len <= 10) return 48
    if (len <= 20) return 36
    if (len <= 40) return 28
    return 22
  })
</script>
