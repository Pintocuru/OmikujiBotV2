<template>
  <div v-if="visible" class="fixed z-50 pointer-events-none" :style="style">
    <div class="bg-base-200 shadow-lg rounded p-2 pointer-events-auto">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'

  const props = defineProps<{
    x: number
    y: number
    visible: boolean
  }>()

  // 画面外にはみ出ないよう軽く補正
  const OFFSET = 12

  const style = computed(() => ({
    left: props.x + OFFSET + 'px',
    top: props.y + OFFSET + 'px',
  }))
</script>
