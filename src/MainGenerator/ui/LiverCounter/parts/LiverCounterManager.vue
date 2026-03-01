<!-- src/MainGenerator/ui/LiverCounter/parts/LiverCounterManager.vue -->
<template>
  <div class="w-full bg-base-100" :data-theme="settings.color">
    <component :is="currentComponent" :counters="counters" :settings="settings" :event-labels="eventLabels" />
  </div>
</template>

<script setup lang="ts">
  import { computed, type Component } from 'vue'
  import type { LiverComponent, SettingsLiverCounterType } from '@/types/'
  import basicCircle from './BasicCircle.vue'
  import magicalStone from './MagicalStones.vue'
  import starBurst from './StarBurst.vue'
  import pixelBadge from './PixelBadge.vue'
  import hexGrid from './HexGrid.vue'

  const props = defineProps<{
    settings: SettingsLiverCounterType
    counters: Record<string, number>
    eventLabels: Record<string, string>
  }>()

  const componentMap: Record<LiverComponent, Component> = {
    basicCircle,
    magicalStone,
    starBurst,
    pixelBadge,
    hexGrid,
  }

  const currentComponent = computed(() => {
    return componentMap[props.settings.component] ?? basicCircle
  })
</script>
