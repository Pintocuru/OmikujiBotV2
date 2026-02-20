<!-- src/ConfigMaker/components/placeholders/PlaceholderInputMode.vue -->
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
            @input="updateWeight(index, $event, handleUpdate)"
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
            @input="updateContent(index, $event, handleUpdate)"
            placeholder="プレースホルダーの内容"
            class="input input-bordered input-sm w-full"
          />
        </div>

        <!-- 複製・削除ボタン -->
        <div class="mt-2 sm:mt-0 sm:ml-auto">
          <MenuDropdown @duplicate="duplicateValue(index, handleUpdate)" @delete="removeValue(index, handleUpdate)" />
        </div>
      </div>
    </div>
  </div>

  <!-- データが空であるとき -->
  <div v-else>
    <NoParamsCard message="プレースホルダーの内容が空です" />
  </div>

  <button @click="addValue(handleUpdate)" class="btn btn-primary w-full mt-4">+ 値を追加</button>
</template>

<script setup lang="ts">
  import { useOmikujiStore } from '@config/stores/useOmikujiStore'
  import { WeightValuesArrayType } from '@/types/OmikujiData/PlaceholderSchema'
  import { useWeightValueManagement } from '@config/components/postAction/ActionSet/useWeightValueManagement'
  import NoParamsCard from '@shared/components/parts/NoParamsCard.vue'
  import MenuDropdown from '@shared/components/parts/MenuDropdown.vue'

  const props = defineProps<{
    placeholderId: string
    values: WeightValuesArrayType
  }>()

  const omikujiStore = useOmikujiStore()

  // values を取得
  const getValues = () => props.values

  // コンポーザブルを使用（循環参照チェックは不要なのでcurrentKeyは渡さない）
  const { displayValues, getWeightPercentage, addValue, removeValue, duplicateValue, updateWeight, updateContent } =
    useWeightValueManagement(getValues)

  // 更新処理（ストアに直接保存）
  const handleUpdate = (newValues: WeightValuesArrayType) => {
    omikujiStore.updatePlaceholderValues(props.placeholderId, newValues)
  }
</script>
