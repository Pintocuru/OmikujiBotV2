<!-- src/ConfigMaker/components/events/OmikujiCard/OmikujiWeightProgressBar.vue -->
<template>
  <div v-if="items.length > 0">
    <div class="space-y-2">
      <!-- 凡例（ドラッグ可能） -->
      <VueDraggable
        v-model="draggableItems"
        handle=".legend-drag-handle"
        :animation="200"
        class="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2"
      >
        <OmikujiLegendItem
          v-for="(item, index) in draggableItems"
          :key="item.id ?? `legend-${index}`"
          :category="category"
          :selectedItemKey="selectedItemKey"
          :item="item"
          :color="getColorForIndex(index)"
          :percentage="String(localItems[index]?.weightPercent)"
          :isSelected="selectedId === item.id"
          @update:weight="$emit('update:weight', { index, weight: $event })"
          @select="$emit('select', item.id)"
        />
      </VueDraggable>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { VueDraggable } from 'vue-draggable-plus'
  import { EventCategoryType, OmikujiItemType } from '@/types/OmikujiData/'
  import OmikujiLegendItem from './OmikujiLegendItem.vue'
  import { addWeightPercentages } from '@shared/utils/omikuji/DrawOmikuji'
  import { getColorForIndex } from './useOmikujiWeight'

  const props = defineProps<{
    category: EventCategoryType
    selectedItemKey: string | null
    items: OmikujiItemType[]
    selectedId: string | null
  }>()

  const emit = defineEmits<{
    'update:items': [items: OmikujiItemType[]]
    'update:weight': [payload: { index: number; weight: number }]
    select: [id: string]
  }>()

  const localItems = computed(() => addWeightPercentages(props.items))

  const draggableItems = computed({
    get: () => props.items,
    set: (val: OmikujiItemType[]) => {
      emit('update:items', val)
    },
  })
</script>
