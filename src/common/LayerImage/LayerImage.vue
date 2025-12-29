<!-- src\common\LayerImage\LayerImage.vue -->
<template>
  <div class="relative overflow-hidden" :class="[sizeClass, round && 'rounded-full', border && 'border']">
    <template v-if="sources.length">
      <img
        v-for="(src, i) in sources"
        :key="i"
        :src="src"
        class="absolute inset-0 object-contain"
        :style="{ zIndex: sources.length - i }"
        @error="onError(i)"
      />
    </template>
  </div>
</template>

<script setup lang="ts">
  import { computed, ref } from 'vue'
  import { getImagePath } from '@/types'

  const props = defineProps<{
    layers: string[] | string
    size?: number
    round?: boolean
    border?: boolean
  }>()

  const errorIndexes = ref(new Set<number>())

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
</script>
