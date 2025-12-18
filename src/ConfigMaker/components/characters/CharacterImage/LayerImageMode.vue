<!-- src/configMaker/components/characters/parts/LayerImageMode.vue -->
<template>
  <div class="space-y-2">
    <LayerItem
      v-for="(layer, index) in layers"
      :key="index"
      :layer="layer"
      :index="index"
      :total-layers="layers.length"
      @update="(value) => emit('update', index, value)"
      @remove="emit('remove', index)"
      @move-up="emit('moveUp', index)"
      @move-down="emit('moveDown', index)"
    />

    <button type="button" class="btn btn-sm btn-outline w-full" @click="emit('add')">
      <Plus class="w-4 h-4 mr-1" />
      レイヤーを追加
    </button>
    <div class="mt-2">
      <div class="text-xs text-base-content/60 mb-1">合成プレビュー:</div>
      <ImagePreviewWrapper :layers="layers" :size="32" />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { Plus } from 'lucide-vue-next'
  import LayerItem from './LayerItem.vue'
  import ImagePreviewWrapper from './ImagePreviewWrapper.vue'

  defineProps<{
    layers: string[]
    emotionLabel: string
  }>()

  const emit = defineEmits<{
    update: [index: number, value: string]
    add: []
    remove: [index: number]
    moveUp: [index: number]
    moveDown: [index: number]
  }>()
</script>
