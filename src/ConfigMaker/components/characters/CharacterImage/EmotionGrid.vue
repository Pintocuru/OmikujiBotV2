<!-- src/ConfigMaker/components/characters/CharacterImage/EmotionGrid.vue -->
<template>
  <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
    <div
      v-for="(item, key) in images"
      :key="key"
      class="cursor-pointer rounded-lg border-2 transition-all hover:shadow-lg hover:border-primary group"
      :class="selectedKey === String(key) ? 'border-primary bg-primary/10' : 'border-base-200'"
      @click="emit('select', String(key))"
    >
      <div class="text-center p-2">
        <div class="w-24 h-24 mx-auto relative">
          <LayerImage :layers="item.src" :size="24" />
          <!-- ホバー時に編集アイコンをオーバーレイ -->
          <div
            class="absolute inset-0 bg-base-100/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded"
          >
            <Pencil class="w-6 h-6 text-primary" />
          </div>
        </div>
        <p class="text-sm text-base-content mt-2 truncate">{{ item.label || key }}</p>
        <p class="text-xs text-base-content/50">{{ key }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import LayerImage from '@/common/LayerImage/LayerImage.vue'
  import type { CharacterImageType } from '@/types/'

  defineProps<{
    images: CharacterImageType
    selectedKey?: string
  }>()

  const emit = defineEmits<{
    select: [key: string]
  }>()
</script>
