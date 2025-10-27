<!-- src/ConfigMaker/components/characters/CharacterImage/LayerImage.vue -->
<template>
  <div
    class="relative overflow-hidden rounded"
    :class="[sizeClass, border ? 'border' : '']"
    @click="showPreview = true"
  >
    <img
      v-for="(layer, index) in layerArray"
      :key="index"
      :src="getImagePath(layer)"
      class="absolute inset-0 object-contain"
      :style="{ zIndex: layerArray.length - index }"
    />
  </div>

  <!-- 拡大プレビュー -->
  <Transition name="fade">
    <div
      v-if="isPreview && showPreview"
      class="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
      @click.self="showPreview = false"
    >
      <div class="relative w-[256px] h-[256px] bg-white rounded overflow-hidden">
        <img
          v-for="(layer, index) in layerArray"
          :key="index"
          :src="getImagePath(layer)"
          class="absolute inset-0 object-contain"
          :style="{ zIndex: layerArray.length - index }"
        />
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
  import { computed, ref } from 'vue'
  import { getImagePath } from '@/types/'

  // ✅ デフォルト値を明示的に指定
  const props = withDefaults(
    defineProps<{
      layers?: string[] | string
      size?: number
      border?: boolean
      isPreview?: boolean
    }>(),
    {
      isPreview: false,
    }
  )

  // サイズクラス
  const sizeClass = computed(() => (props.size ? `w-${props.size} h-${props.size}` : 'w-16'))
  // 常に配列に変換
  const layerArray = computed(() => (Array.isArray(props.layers) ? props.layers : [props.layers]))

  const showPreview = ref(false)
</script>

<style scoped>
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.2s;
  }
  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }

  .relative {
    aspect-ratio: 1 / 1;
  }
</style>
