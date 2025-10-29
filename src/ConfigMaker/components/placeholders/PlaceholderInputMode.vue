<!-- src/configMaker/components/placeholders/PlaceholderInputMode.vue -->
<template>
  <div v-if="displayValues.length > 0" class="space-y-1 max-h-128 overflow-y-auto">
    <div v-for="(value, index) in displayValues" :key="index" class="card bg-base-100 p-2">
      <div class="flex flex-col sm:flex-row sm:items-center sm:gap-2">
        <!-- 重み (パーセンテージ表示) -->
        <div class="w-full sm:w-32">
          <label class="text-xs text-gray-500 mb-1 block"> 重み ({{ getWeightPercentage(value.weight) }}%) </label>
          <input
            type="number"
            :value="value.weight"
            @input="updateWeight(index, $event)"
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
            :value="value.content"
            @input="updateContent(index, $event)"
            placeholder="プレースホルダーの内容"
            class="input input-bordered input-sm w-full"
          />
        </div>

        <!-- 複製・削除ボタン -->
        <div class="mt-2 sm:mt-0 sm:ml-auto">
          <MenuDropdown @duplicate="handleDuplicate(index)" @delete="handleRemove(index)" />
        </div>
      </div>
    </div>
  </div>

  <!-- データが空であるとき -->
  <div v-else>
    <NoParamsCard message="プレースホルダーの内容が空です" />
  </div>

  <button @click="handleAdd" class="btn btn-primary w-full mt-4">+ 値を追加</button>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { useOmikujiStore } from '@/ConfigMaker/stores/useOmikujiStore'
  import {
    PlaceholderValueType,
    handelNormalizedValues,
    PlaceholderValueObjectSchema,
  } from '@/types/OmikujiData/PlaceholderSchema'
  import NoParamsCard from '@shared/components/parts/NoParamsCard.vue'
  import MenuDropdown from '@shared/components/parts/MenuDropdown.vue'

  const props = defineProps<{
    placeholderId: string
    values: Array<PlaceholderValueType | string>
  }>()

  // ストアを使用
  const omikujiStore = useOmikujiStore()

  // 表示用に正規化された値（stringをオブジェクトに変換）
  const displayValues = computed(() => handelNormalizedValues(props.values))

  // 全体の重みの合計を計算
  const totalWeight = computed(() => {
    return displayValues.value.reduce((sum, item) => sum + (item.weight || 0), 0)
  })

  // 各項目の重みのパーセンテージを計算
  const getWeightPercentage = (weight: number) => {
    if (totalWeight.value === 0) return '0.00'
    return ((weight / totalWeight.value) * 100).toFixed(2)
  }

  // 新しい値を追加
  const handleAdd = () => {
    const newValue = PlaceholderValueObjectSchema.parse({})
    const updatedValues = [...props.values, newValue]
    omikujiStore.updatePlaceholderValues(props.placeholderId, updatedValues)
  }

  // 値の更新
  const handleUpdate = (index: number, updates: Partial<PlaceholderValueType>) => {
    const values = [...props.values]
    const currentValue = values[index]

    if (typeof currentValue === 'string') {
      // stringの場合はオブジェクトに変換
      values[index] = { content: currentValue, weight: 1, ...updates }
    } else {
      // オブジェクトの場合は更新
      values[index] = { ...currentValue, ...updates }
    }

    omikujiStore.updatePlaceholderValues(props.placeholderId, values)
  }

  // 値の削除
  const handleRemove = (index: number) => {
    const updatedValues = props.values.filter((_, i) => i !== index)
    omikujiStore.updatePlaceholderValues(props.placeholderId, updatedValues)
  }

  // 値の複製
  const handleDuplicate = (index: number) => {
    const original = props.values[index]
    let duplicated: PlaceholderValueType | string

    if (typeof original === 'string') {
      duplicated = `${original}(コピー)`
    } else {
      duplicated = { ...original, content: `${original.content}(コピー)` }
    }

    const updatedValues = [...props.values]
    updatedValues.splice(index + 1, 0, duplicated)
    omikujiStore.updatePlaceholderValues(props.placeholderId, updatedValues)
  }

  // 重み更新
  const updateWeight = (index: number, event: Event) => {
    const target = event.target as HTMLInputElement
    const weight = parseInt(target.value) || 1
    handleUpdate(index, { weight })
  }

  // 内容更新
  const updateContent = (index: number, event: Event) => {
    const target = event.target as HTMLInputElement
    const content = target.value
    handleUpdate(index, { content })
  }
</script>
