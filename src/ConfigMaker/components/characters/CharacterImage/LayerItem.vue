<!-- src/configMaker/components/characters/parts/LayerItem.vue -->
<template>
  <div class="border rounded p-2 bg-base-200">
    <div class="flex items-center gap-2 mb-1">
      <span class="badge badge-sm">{{ index + 1 }}</span>
      <div class="flex-1"></div>
      <button
        type="button"
        class="btn btn-ghost btn-xs"
        @click="emit('moveUp')"
        :disabled="index === 0"
        title="前面へ移動"
      >
        <ChevronUp class="w-3 h-3" />
      </button>
      <button
        type="button"
        class="btn btn-ghost btn-xs"
        @click="emit('moveDown')"
        :disabled="index === totalLayers - 1"
        title="背面へ移動"
      >
        <ChevronDown class="w-3 h-3" />
      </button>
      <button type="button" class="btn btn-error btn-xs" @click="emit('remove')" title="削除">
        <X class="w-3 h-3" />
      </button>
    </div>

    <input
      type="url"
      class="input input-sm w-full"
      :placeholder="`レイヤー${index + 1}の画像URL`"
      :value="layer"
      @input="emit('update', ($event.target as HTMLInputElement).value)"
    />
    <LayerImage :isPreview="true" :layers="layer" :size="12" :border="true" />
  </div>
</template>

<script setup lang="ts">
  import LayerImage from '@/common/LayerImage.vue'
  import { ChevronUp, ChevronDown, X } from 'lucide-vue-next'

  defineProps<{
    layer: string
    index: number
    totalLayers: number
  }>()

  const emit = defineEmits<{
    update: [value: string]
    remove: []
    moveUp: []
    moveDown: []
  }>()
</script>
