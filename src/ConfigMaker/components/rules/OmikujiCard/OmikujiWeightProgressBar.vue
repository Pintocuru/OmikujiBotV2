<!-- src/ConfigMaker/components/rules/OmikujiCard/OmikujiWeightProgressBar.vue -->
<template>
  <div v-if="items.length > 0" class="mt-4">
    <div class="space-y-2">
      <!-- プログレスバー本体 -->
      <div class="flex w-full h-8 rounded overflow-hidden border border-base-300">
        <div
          v-for="(item, index) in localItems"
          :key="index"
          :style="{
            width: `${item.weightPercent}%`,
            backgroundColor: getColorForIndex(index),
          }"
          class="tooltip tooltip-top flex items-center justify-center text-xs text-white font-semibold cursor-pointer hover:brightness-110 transition-all"
          :data-tip="`${items[index].name || `アイテム${index + 1}`}: ${item.weightPercent}%`"
          @click="$emit('select', index)"
        >
          <span v-if="typeof item.weightPercent === 'number' && item.weightPercent > 8" class="truncate px-1">
            {{ item.weightPercent > 12 ? items[index].name || `#${index + 1}` : '' }}
          </span>
        </div>
      </div>

      <!-- 凡例（ドラッグ可能） -->
      <draggable
        :modelValue="items"
        @update:modelValue="$emit('update:items', $event)"
        item-key="id"
        handle=".legend-drag-handle"
        animation="200"
        class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2"
      >
        <template #item="{ element: item, index }">
          <OmikujiLegendItem
            :key="item.id || `legend-${index}`"
            :item="item"
            :index="index"
            :color="getColorForIndex(index)"
            :percentage="String(localItems[index]?.weightPercent)"
            :isSelected="selectedIndex === index"
            @update:weight="$emit('update:weight', { index, weight: $event })"
            @select="$emit('select', index)"
          />
        </template>
      </draggable>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { OmikujiItemType } from '@/types/OmikujiData/'
  import draggable from 'vuedraggable'
  import OmikujiLegendItem from './OmikujiLegendItem.vue'
  import { addWeightPercentages } from '@shared/utils/omikuji/DrawOmikuji'

  const props = defineProps<{
    items: OmikujiItemType[]
    selectedIndex: number | null
  }>()

  const emit = defineEmits<{
    'update:items': [items: OmikujiItemType[]]
    'update:weight': [payload: { index: number; weight: number }]
    select: [index: number]
  }>()

  const localItems = computed(() => addWeightPercentages(props.items))

  const getColorForIndex = (index: number): string => {
    const colors = [
      '#3b82f6',
      '#8b5cf6',
      '#ec4899',
      '#f59e0b',
      '#10b981',
      '#06b6d4',
      '#6366f1',
      '#84cc16',
      '#ef4444',
      '#14b8a6',
      '#f97316',
      '#a855f7',
    ]
    return colors[index % colors.length]
  }
</script>
