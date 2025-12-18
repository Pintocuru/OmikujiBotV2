<!-- src/ConfigMaker/components/rules/OmikujiItemWeight.vue -->
<template>
  <div class="form-control flex-1">
    <!-- 重み -->
    <SettingItem :label="`重み (${weightPercentage}%)`" description="数値が高いほど出やすくなります">
      <input
        type="number"
        :value="omikuji.weight"
        @input="onInput"
        min="0"
        class="input input-bordered input-sm w-full"
      />
    </SettingItem>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import SettingItem from '@ConfigComponents/parts/SettingItem.vue'
  import { OmikujiItemType } from '@/types/OmikujiData/OmikujiSchema'
  import { RulesCategoryType } from '@/types/OmikujiData/RulesSchema'
  import { useOmikujiStore } from '@/ConfigMaker/stores/useOmikujiStore'

  const props = defineProps<{
    allOmikuji: OmikujiItemType[]
    omikuji: OmikujiItemType
    category: RulesCategoryType
    index: number
    selectedItemKey: string | null
  }>()

  const omikujiStore = useOmikujiStore()

  // 全体の重みの合計を計算
  const totalWeight = computed(() => props.allOmikuji.reduce((sum, item) => sum + (item.weight || 0), 0))

  // 現在のおみくじの出現率を計算
  const weightPercentage = computed(() => {
    if (totalWeight.value === 0) return '0.00'
    return ((props.omikuji.weight / totalWeight.value) * 100).toFixed(2)
  })

  const onInput = (e: Event) => {
    updateWeight(parseFloat((e.target as HTMLInputElement).value))
  }

  // 重み更新
  const updateWeight = (value: number) => {
    if (props.index === -1 || !props.selectedItemKey) return
    omikujiStore.updateOmikujiByIndex(props.category, props.selectedItemKey, props.index, (item) => ({
      ...item,
      weight: value,
    }))
  }
</script>
