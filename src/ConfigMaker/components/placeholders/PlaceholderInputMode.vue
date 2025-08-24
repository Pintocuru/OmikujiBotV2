<!-- src/configMaker/components/placeholders/PlaceholderInputMode.vue -->
<template>
  <div v-if="normalizedValues.length > 0" class="space-y-1 max-h-128 overflow-y-auto">
    <div v-for="(value, index) in normalizedValues" :key="index" class="card bg-base-100 p-2">
      <div class="flex flex-col sm:flex-row sm:items-center sm:gap-2">
        <!-- 重み (パーセンテージ表示) -->
        <div class="w-full sm:w-32">
          <label class="text-xs text-gray-500 mb-1 block"> 重み ({{ getWeightPercentage(value.weight) }}%) </label>
          <input
            type="number"
            v-model.number="value.weight"
            min="0"
            class="input input-bordered input-sm w-full"
            placeholder="重み"
          />
        </div>

        <!-- 内容 -->
        <div class="flex-1">
          <label class="text-xs text-gray-500 mb-1 block">内容</label>
          <input
            type="text"
            v-model="value.content"
            placeholder="プレースホルダーの内容"
            class="input input-bordered input-sm w-full"
          />
        </div>

        <!-- 複製・削除ボタン -->
        <div class="mt-2 sm:mt-0 sm:ml-auto">
          <MenuDropdown @duplicate="$emit('duplicate-value', index)" @delete="$emit('remove-value', index)" />
        </div>
      </div>
    </div>
  </div>

  <!-- データが空であるとき -->
  <div v-else>
    <NoParamsCard message="プレースホルダーの内容が空です" />
  </div>

  <button @click="$emit('add-value')" class="btn btn-primary w-full mt-4">+ 値を追加</button>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { PlaceholderValueType } from '@/types/'
  import NoParamsCard from '@ConfigComponents/parts/NoParamsCard.vue'
  import MenuDropdown from '@ConfigComponents/parts/MenuDropdown.vue'

  const props = defineProps<{
    localValues: Array<PlaceholderValueType | string>
  }>()

  defineEmits<{
    'add-value': []
    'remove-value': [index: number]
    'duplicate-value': [index: number]
  }>()

  const normalizedValues = computed(() => {
    return props.localValues.map((item) => {
      if (typeof item === 'string') {
        return { content: item, weight: 1 }
      }
      return item
    })
  })

  // 全体の重みの合計を計算
  const totalWeight = computed(() => {
    return normalizedValues.value.reduce((sum, item) => sum + (item.weight || 0), 0)
  })

  // 各項目の重みのパーセンテージを計算
  const getWeightPercentage = (weight: number) => {
    if (totalWeight.value === 0) return '0.00'
    return ((weight / totalWeight.value) * 100).toFixed(2)
  }
</script>
