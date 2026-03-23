<!-- src/ConfigMaker/components/rules/OmikujiCard/OmikujiCardControls.vue -->
<template>
  <div class="space-y-4">
    <!-- ツールバー 
    <OmikujiControlsToolbar
      :itemCount="itemCount"
      :totalWeight="totalWeight"
      @sort="$emit('sort', $event)"
      @weight-operation="handleWeightOperation"
    />-->

    <!-- プログレスバーと凡例 -->
    <OmikujiWeightProgressBar
      :items="localItems"
      :selectedIndex="selectedIndex"
      @update:items="localItems = $event"
      @update:weight="handleWeightUpdate"
      @select="handleSelect"
    />
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { OmikujiItemType } from '@/types/OmikujiData/'
  // import OmikujiControlsToolbar from './OmikujiControlsToolbar.vue'
  import OmikujiWeightProgressBar from './OmikujiWeightProgressBar.vue'
  // import { useWeightCalculation } from '../composables/useWeightCalculation'

  const props = defineProps<{
    items: OmikujiItemType[]
    selectedIndex: number | null
  }>()

  const emit = defineEmits<{
    sort: [payload: { type: 'weight' | 'name'; order?: 'asc' | 'desc' }]
    'update:items': [items: OmikujiItemType[]]
    select: [index: number]
  }>()

  // ローカルアイテム（ドラッグ&ドロップ用）
  const localItems = computed({
    get: () => props.items,
    set: (value) => emit('update:items', value),
  })

  // Weight更新
  const handleWeightUpdate = (payload: { index: number; weight: number }) => {
    const updatedItems = [...localItems.value]
    updatedItems[payload.index] = {
      ...updatedItems[payload.index],
      weight: payload.weight,
    }
    emit('update:items', updatedItems)
  }

  // アイテム選択
  const handleSelect = (index: number) => {
    emit('select', index)
  }

  /**
  // weight計算のコンポーザブルを使用
  // const { totalWeight } = useWeightCalculation(localItems)
  // const itemCount = computed(() => props.items.length)

  // Weight操作
  const handleWeightOperation = (operation: string, targetTotal?: number) => {
    let updatedItems = [...localItems.value]

    switch (operation) {
      case 'equalize':
        updatedItems = updatedItems.map((item) => ({
          ...item,
          weight: 1,
        }))
        break

      case 'randomize':
        updatedItems = updatedItems.map((item) => ({
          ...item,
          weight: Math.floor(Math.random() * 10) + 1,
        }))
        break

      case 'normalize':
        updatedItems = scaleWeightsToTotal(updatedItems, 100)
        break

      case 'scale':
        if (targetTotal && targetTotal > 0) {
          updatedItems = scaleWeightsToTotal(updatedItems, targetTotal)
        }
        break
    }

    emit('update:items', updatedItems)
  }
     

  const scaleWeightsToTotal = (items: OmikujiItemType[], targetSum: number): OmikujiItemType[] => {
    const currentTotal = items.reduce((sum, item) => sum + item.weight, 0)
    if (currentTotal === 0) return items

    const ratio = targetSum / currentTotal
    return items.map((item) => ({
      ...item,
      weight: Math.max(1, Math.round(item.weight * ratio)),
    }))
  }
  */
</script>
