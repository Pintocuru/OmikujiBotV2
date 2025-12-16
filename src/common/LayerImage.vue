<!-- src\common\LayerImage.vue -->
<template>
  <div
    class="relative overflow-hidden rounded"
    :class="[sizeClass, border ? 'border' : '', round ? 'rounded-full' : '']"
  >
    <img
      v-for="(layer, index) in layerArray"
      :key="index"
      :src="getImagePath(layer)"
      class="absolute inset-0 object-contain"
      :style="{ zIndex: layerArray.length - index }"
    />
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { getImagePath } from '@/types/'

  // ✅ デフォルト値を明示的に指定
  const props = withDefaults(
    defineProps<{
      layers?: string[] | string
      size?: number
      border?: boolean
      round?: boolean
    }>(),
    {
      size: 16,
    }
  )

  // サイズクラス
  const sizeClass = computed(() => `w-${props.size} h-${props.size}`)
  // 常に配列に変換
  const layerArray = computed(() => (Array.isArray(props.layers) ? props.layers : [props.layers]))
</script>
