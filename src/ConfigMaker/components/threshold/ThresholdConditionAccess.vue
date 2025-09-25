<!-- src/configMaker/components/comments/ThresholdConditionAccess.vue -->
<template>
  <SettingItem label="ユーザーの役職" description="メンバー限定の発動条件はここです!">
    <div class="flex flex-wrap gap-2">
      <label
        v-for="option in accessOptions"
        :key="option.value"
        class="flex items-center gap-2 hover:bg-base-300 p-2 rounded cursor-pointer text-sm"
      >
        <input
          type="checkbox"
          class="checkbox checkbox-sm"
          :checked="modelValue.includes(option.value)"
          @change="toggleOption(option.value)"
        />
        <span>{{ option.label }}</span>
      </label>
    </div>
  </SettingItem>
</template>

<script setup lang="ts">
  import SettingItem from '@shared/components/parts/SettingItem.vue'
  import { accessConditionLabels, type AccessCondition } from '@shared/types'

  const props = defineProps<{ modelValue: AccessCondition[] }>()
  const emit = defineEmits<{ 'update:modelValue': [value: AccessCondition[]] }>()

  // 選択肢の生成
  const accessOptions = Object.entries(accessConditionLabels).map(([value, label]) => ({
    value: value as AccessCondition,
    label,
  }))

  // オプションの切り替え
  const toggleOption = (value: AccessCondition) => {
    const index = props.modelValue.indexOf(value)
    const newValue = index > -1 ? props.modelValue.filter((_, i) => i !== index) : [...props.modelValue, value]

    emit('update:modelValue', newValue)
  }
</script>
