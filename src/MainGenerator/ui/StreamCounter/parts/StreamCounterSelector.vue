<!-- src/MainGenerator/ui/StreamCounter/parts/StreamCounterSelector.vue -->
<template>
  <div class="w-full bg-base-100 transparent-bg" :data-theme="settings.color">
    <div class="flex flex-wrap justify-center gap-2 py-2">
      <!-- allKeys が空のときのツッコミ -->
      <div v-if="allKeys.length === 0" class="badge badge-error font-bold py-4">表示するカウンターはありません</div>

      <!-- 通常表示 -->
      <div v-else v-for="(key, index) in allKeys" :key="key">
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
  import type { StreamCounterType, LiverComponent } from '@/types/'

  import BasicCirclePlainItem from '../layouts/BasicCirclePlain.vue'
  import BasicCircleItem from '../layouts/BasicCircle.vue'
  import PixelBadgePlainItem from '../layouts/PixelBadgePlain.vue'
  import PixelBadgeItem from '../layouts/PixelBadge.vue'
  import MagicalStoneItem from '../layouts/MagicalStone.vue'
  import StarBurstItem from '../layouts/StarBurst.vue'
  import HexGridItem from '../layouts/HexGrid.vue'

  import { useStreamCounterDisplay } from '../composables/useStreamCounterDisplay'
  import { useLiverLabelResolver } from '../composables/useLiverLabelResolver'

  const props = defineProps<{
    settings: StreamCounterType
    counters: Record<string, number>
    eventLabels: Record<string, string>
  }>()

  const { getLabel } = useLiverLabelResolver(toRef(props, 'eventLabels'), toRef(props.settings, 'labelStyle'))
  const { allKeys, getPattern, formatValue } = useStreamCounterDisplay(toRef(props, 'settings'))

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
