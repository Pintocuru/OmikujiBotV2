<template>
  <video
    v-if="isVideo"
    :src="src"
    autoplay
    :loop="loop"
    muted
    playsinline
    class="object-contain w-full h-full"
    @error="emit('error')"
  />
  <img v-else :src="src" class="object-contain w-full h-full" @error="emit('error')" />
</template>

<script setup lang="ts">
  import { computed } from 'vue'

  const props = defineProps<{
    src: string
    loop?: boolean
  }>()
  const emit = defineEmits<{ error: [] }>()

  const isVideo = computed(() => /\.(webm|mp4)$/i.test(props.src))
</script>
