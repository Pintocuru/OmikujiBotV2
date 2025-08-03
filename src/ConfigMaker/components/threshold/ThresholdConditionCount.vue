<!-- src/configMaker/components/comments/ThresholdConditionCount.vue -->
<template>
 <div class="form-control bg-base-100 p-3 rounded-lg">
  <SettingItem
   label="チャット数条件"
   description="配信枠・個人の総合チャット数で判定"
   :show-reset="false"
  >
   <div class="flex gap-2">
    <select
     :value="modelValue.unit"
     @change="updateField('unit', $event)"
     class="select select-bordered select-sm flex-1"
    >
     <option v-for="option in unitOptions" :key="option.value" :value="option.value">
      {{ option.label }}
     </option>
    </select>
    <select
     :value="modelValue.comparison"
     @change="updateField('comparison', $event)"
     class="select select-bordered select-sm flex-1"
    >
     <option v-for="option in comparisonOptions" :key="option.value" :value="option.value">
      {{ option.label }}
     </option>
    </select>
    <input
     type="number"
     :value="modelValue.value"
     @input="updateField('value', $event)"
     min="0"
     class="input input-bordered input-sm flex-1"
     placeholder="数値"
    />
   </div>
  </SettingItem>
 </div>
</template>

<script setup lang="ts">
import {
 countUnitConditionLabels,
 countComparisonConditionLabels,
 CountConditionType,
 CountUnitCondition,
 CountComparisonCondition
} from '@type/';
import SettingItem from '@/ConfigMaker/components/parts/SettingItem.vue';

const props = defineProps<{ modelValue: CountConditionType }>();
const emit = defineEmits<{ 'update:modelValue': [value: CountConditionType] }>();

// 選択肢の生成
const unitOptions = Object.entries(countUnitConditionLabels).map(([value, label]) => ({
 value: value as CountUnitCondition,
 label
}));

const comparisonOptions = Object.entries(countComparisonConditionLabels).map(([value, label]) => ({
 value: value as CountComparisonCondition,
 label
}));

// フィールドの更新
const updateField = (field: keyof CountConditionType, event: Event) => {
 const target = event.target as HTMLInputElement | HTMLSelectElement;
 const value = field === 'value' ? parseInt(target.value) : target.value;

 if (field === 'value' && isNaN(value as number)) return;

 emit('update:modelValue', { ...props.modelValue, [field]: value });
};
</script>
