<!-- src/common/LayerImage.vue -->
<template>
  <div
    class="relative overflow-hidden rounded"
    :class="[sizeClass, border ? 'border' : '', round ? 'rounded-full' : '']"
  >
    <!-- 画像がある場合 -->
    <div v-if="hasValidImages">
      <img
        v-for="(layer, index) in validLayers"
        :key="index"
        :src="getImagePath(layer)"
        class="absolute inset-0 object-contain"
        :style="{ zIndex: validLayers.length - index }"
        @error="handleImageError(layer)"
      />
    </div>

    <!-- 画像がない場合のフォールバック -->
    <div v-else class="w-full h-full flex items-center justify-center bg-base-200 text-base-content">
      <span :class="textSizeClass">画像なし</span>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed, ref } from 'vue'
  import { getImagePath } from '@/types/'

  const props = withDefaults(
    defineProps<{
      layers?: string[] | string
      size?: number
      border?: boolean
      round?: boolean
      showPlaceholder?: boolean // 追加: フォールバック表示を制御
    }>(),
    {
      size: 16,
      showPlaceholder: true, // デフォルトで表示
    }
  )

  // 画像エラーの追跡
  const imageErrors = ref<Set<string>>(new Set())

  // 有効なレイヤーのみをフィルタリング
  const validLayers = computed(() => {
    const layers = Array.isArray(props.layers) ? props.layers : [props.layers]
    return layers.filter((layer) => layer && !imageErrors.value.has(layer))
  })

  // 有効な画像があるかどうか
  const hasValidImages = computed(() => {
    if (!props.layers) return false
    return validLayers.value.length > 0
  })

  // 画像読み込みエラーハンドラー
  const handleImageError = (layer?: string) => {
    console.error('画像読み込み失敗:', layer, getImagePath(layer))
    if (layer) imageErrors.value.add(layer)
  }

  // サイズクラス
  const sizeClass = computed(() => `w-${props.size} h-${props.size}`)

  // テキストサイズクラス（サイズに応じて調整）
  const textSizeClass = computed(() => {
    const sizes: Record<number, string> = {
      6: 'text-xs',
      8: 'text-xs',
      12: 'text-sm',
      16: 'text-base',
      24: 'text-lg',
    }
    return sizes[props.size] || 'text-sm'
  })
</script>
