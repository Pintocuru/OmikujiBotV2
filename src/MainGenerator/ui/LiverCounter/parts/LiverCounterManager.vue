<!-- src/MainGenerator/ui/FlashBanner/parts/LiverCounterManager.vue -->
<template>
  <div class="w-full" :data-theme="settings.color">
    <component :is="currentComponent" :counters="counters" :settings="settings" />
  </div>
</template>

<script setup lang="ts">
  import { computed, type Component } from 'vue'
  import type { SettingsLiverCounterType } from '@/types/'
  import BasicCircle from './BasicCircle.vue'

  const props = defineProps<{
    settings: SettingsLiverCounterType
    counters: Record<string, number>
  }>()

  const componentMap: Record<string, Component> = {
    basicCircle: BasicCircle,
  }

  const currentComponent = computed(() => {
    return componentMap[props.settings.component] ?? BasicCircle
  })
</script>
