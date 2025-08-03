<!-- src/configMaker/components/comments/ThresholdConditionSyoken.vue -->
<template>
 <div class="form-control bg-base-100 p-3 rounded-lg">
  <SettingItem
   label="初見判定ちゃん"
   description="初見ユーザー、または配信枠の1コメを判定"
   :show-reset="false"
  >
   <div class="flex flex-wrap gap-2">
    <label
     v-for="option in syokenOptions"
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
 </div>
</template>

<script setup lang="ts">
import { syokenConditionLabels, type SyokenCondition } from '@type/';
import SettingItem from '@/ConfigMaker/components/parts/SettingItem.vue';

const props = defineProps<{ modelValue: SyokenCondition[] }>();
const emit = defineEmits<{ 'update:modelValue': [value: SyokenCondition[]] }>();

// 選択肢の生成
const syokenOptions = Object.entries(syokenConditionLabels).map(([value, label]) => ({
 value: value as SyokenCondition,
 label
}));

// オプションの切り替え
const toggleOption = (value: SyokenCondition) => {
 const index = props.modelValue.indexOf(value);
 const newValue =
  index > -1 ? props.modelValue.filter((_, i) => i !== index) : [...props.modelValue, value];

 emit('update:modelValue', newValue);
};
</script>
