<!-- src/MainGenerator/ui/CookieCounter/layouts/SakuraPetal.vue -->
<template>
  <img
    v-if="resolvedSrc"
    :src="resolvedSrc"
    class="object-contain"
    :class="$attrs.class"
    :style="$attrs.style"
    alt=""
    draggable="false"
  />
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { getImagePath } from '@/types'

  defineOptions({ inheritAttrs: false })

  const props = defineProps<{ src: string }>()

  const resolvedSrc = computed(() => getImagePath(props.src))
</script>
