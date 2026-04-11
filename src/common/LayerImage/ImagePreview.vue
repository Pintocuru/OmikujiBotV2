<!-- src/common/LayerImage/ImagePreview.vue -->
<template>
  <div @click="showPreview = true" class="cursor-pointer">
    <LayerImage2 :layers="layers" :width="width" :animation="animation" />
  </div>

  <Transition name="fade">
    <div
      v-if="showPreview"
      class="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
      @click.self="showPreview = false"
    >
      <div class="relative bg-white rounded overflow-hidden">
        <LayerImage2 :layers="layers" :width="256" />
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import LayerImage2 from '@/common/LayerImage/LayerImage2.vue'
  import { CharacterAnimationType } from '@/types'

  defineProps<{
    layers: string[] | string
    width: number // 表示サイズ
    animation?: CharacterAnimationType
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
