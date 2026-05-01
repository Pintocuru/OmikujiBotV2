<!-- src/ConfigMaker/components/postAction/ActionSet/ActionSetSettings.vue -->
<template>
  <div>
    <!-- 重み付きリスト表示 -->
    <div v-if="displayValues.length > 0" class="space-y-1 max-h-128 overflow-y-auto">
      <div v-for="(value, index) in displayValues" :key="index" class="card bg-base-100 p-2 border border-base-300">
        <div class="flex flex-col sm:flex-row sm:items-center sm:gap-2">
          <!-- 重み -->
          <div class="w-full sm:w-32">
            <label class="text-xs text-gray-500 mb-1 block"> 重み ({{ getWeightPercentage(value.weight) }}%) </label>
            <input
              type="number"
              :value="value.weight"
              @input="updateWeight(index, $event, handleUpdate)"
              min="0"
              class="input input-bordered input-sm w-full"
            />
          </div>

          <!-- アクションセット選択 -->
          <div class="flex-1">
            <label class="text-xs text-gray-500 mb-1 block">アクションセット</label>
            <select
              :value="value.content"
              @change="updateContent(index, $event, handleUpdate)"
              class="select select-bordered select-sm w-full"
              :class="{ 'select-error': isCircular(value.content) }"
            >
              <option value="">-- 選択してください --</option>

              <option
                v-for="option in availableActionSets"
                :key="option.key"
                :value="option.key"
                :disabled="option.disabled"
              >
                {{ option.name }} {{ option.disabled ? '(循環参照)' : '' }}
              </option>
            </select>

            <!-- 循環参照警告 -->
            <div v-if="isCircular(value.content)" class="alert alert-error py-1 mt-1 text-xs">
              ⚠️ 循環参照: {{ getCircularPath(value.content) }}
            </div>
          </div>

          <!-- 複製・削除 -->
          <div class="mt-2 sm:mt-0 sm:ml-auto">
            <MenuDropdown @duplicate="duplicateValue(index, handleUpdate)" @delete="removeValue(index, handleUpdate)" />
          </div>
        </div>
      </div>
    </div>

    <!-- 空の場合 -->
    <div v-else>
      <NoParamsCard message="アクションセットが空です" />
    </div>

    <button @click="addValue(handleUpdate)" class="btn btn-primary w-full mt-4">+ 値を追加</button>
  </div>
</template>

<script setup lang="ts">
  import { WeightValuesArrayType } from '@/types/OmikujiData/PlaceholderSchema'
  import { PostFlowCallType } from '@/types'
  import { useWeightValueManagement } from './useWeightValueManagement'
  import NoParamsCard from '@shared/components/parts/NoParamsCard.vue'
  import MenuDropdown from '@shared/components/parts/MenuDropdown.vue'

  const props = defineProps<{
    action: PostFlowCallType
    currentKey?: string
  }>()

  const emit = defineEmits<{
    'update:action': [action: PostFlowCallType]
  }>()

  // actionSetKeys を取得
  const getValues = () => props.action.actionSetKeys

  // currentKey を取得
  const getCurrentKey = () => props.currentKey

  // コンポーザブルを使用
  const {
    displayValues,
    getWeightPercentage,
    availableActionSets,
    addValue,
    removeValue,
    duplicateValue,
    updateWeight,
    updateContent,
    isCircular,
    getCircularPath,
  } = useWeightValueManagement(getValues, getCurrentKey)

  // 更新処理
  const handleUpdate = (newValues: WeightValuesArrayType) => {
    emit('update:action', { ...props.action, actionSetKeys: newValues })
  }
</script>
