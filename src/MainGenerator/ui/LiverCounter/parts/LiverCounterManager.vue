<!-- src/MainGenerator/ui/LiverCounter/parts/LiverCounterManager.vue -->
<template>
  <div class="w-full bg-base-100" :data-theme="settings.color">
    <div class="flex flex-wrap justify-center gap-4 py-4">
      <div v-for="(key, index) in allKeys" :key="key">
        <component
          :is="currentItem"
          :index="index"
          :label="getLabel(key)"
          :value="formatValue(counters[key] ?? 0)"
          :color-pattern="getPattern(key)"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed, toRef, type Component } from 'vue'
  import type { SettingsLiverCounterType, LiverComponent } from '@/types/'

  import BasicCirclePlainItem from './BasicCirclePlain.vue'
  import BasicCircleItem from './BasicCircle.vue'
  import PixelBadgePlainItem from './PixelBadgePlain.vue'
  import PixelBadgeItem from './PixelBadge.vue'
  import MagicalStoneItem from './MagicalStone.vue'
  import StarBurstItem from './StarBurst.vue'
  import HexGridItem from './HexGrid.vue'

  import { useLiverCounterDisplay } from '../composables/useLiverCounterDisplay'
  import { useLiverLabelResolver } from '../composables/useLiverLabelResolver'

  const props = defineProps<{
    settings: SettingsLiverCounterType
    counters: Record<string, number>
    eventLabels: Record<string, string>
  }>()

  const { getLabel } = useLiverLabelResolver(props.eventLabels)
  const { allKeys, getPattern, formatValue } = useLiverCounterDisplay(toRef(props, 'settings'))

  const itemMap: Record<LiverComponent, Component> = {
    basicCirclePlain: BasicCirclePlainItem,
    basicCircle: BasicCircleItem,
    pixelBadge: PixelBadgeItem,
    pixelBadgePlain: PixelBadgePlainItem,
    magicalStone: MagicalStoneItem,
    starBurst: StarBurstItem,
    hexGrid: HexGridItem,
  }

  const currentItem = computed(() => itemMap[props.settings.component] ?? BasicCircleItem)
</script>
