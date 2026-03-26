<!-- src/ConfigMaker/components/appItems/preview/HoverPopup.vue -->
<template>
  <Teleport to="body">
    <div v-if="visible" class="fixed z-50 pointer-events-none" :style="style">
      <div class="bg-base-200 shadow-lg rounded p-2 pointer-events-auto">
        <slot />
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
  import { computed } from 'vue'

  const props = defineProps<{
    x: number
    y: number
    visible: boolean
  }>()

  const OFFSET = 12

  const style = computed(() => ({
    left: props.x + OFFSET + 'px',
    top: props.y + OFFSET + 'px',
  }))
</script>
