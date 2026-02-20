<!-- src/common/LayerImage/ImagePreview.vue -->
<template>
  <div @click="showPreview = true" class="cursor-pointer">
    <LayerImage :layers="layers" :size="size" />
  </div>

  <Transition name="fade">
    <div
      v-if="showPreview"
      class="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
      @click.self="showPreview = false"
    >
      <div class="relative w-64 h-64 bg-white rounded overflow-hidden">
        <LayerImage :layers="layers" :size="64" />
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import LayerImage from '@/common/LayerImage/LayerImage.vue'

  defineProps<{
    layers: string[] | string
    size: number // 表示サイズ
  }>()

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
</style>
