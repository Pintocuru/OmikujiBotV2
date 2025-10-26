<!-- src/configMaker/components/characters/parts/ModeToggle.vue -->
<template>
  <div class="flex gap-1 mb-2">
    <button
      type="button"
      class="btn btn-xs"
      :class="isLayerMode ? 'btn-ghost' : 'btn-primary'"
      @click="emit('toggle', false)"
      title="単一画像モード"
    >
      単一
    </button>
    <button
      type="button"
      class="btn btn-xs"
      :class="isLayerMode ? 'btn-primary' : 'btn-ghost'"
      @click="emit('toggle', true)"
      title="レイヤーモード"
    >
      <Layers class="w-3 h-3 mr-1" />
      レイヤー
    </button>
  </div>
</template>

<script setup lang="ts">
  import { Layers } from 'lucide-vue-next'

  defineProps<{
    isLayerMode: boolean
  }>()

  const emit = defineEmits<{
    toggle: [toLayerMode: boolean]
  }>()
</script>
