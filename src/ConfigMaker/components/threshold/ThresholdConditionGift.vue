<!-- src/configMaker/components/comments/ThresholdConditionGift.vue -->
<template>
 <div class="form-control bg-base-100 p-3 rounded-lg">
  <SettingItem label="ギフト条件" description="金額や種類で発動を変更できます" :show-reset="false">
   <div class="flex flex-wrap gap-2">
    <label
     v-for="option in giftOptions"
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
import { giftConditionLabels, type GiftCondition } from '@type/';
import SettingItem from '@/ConfigMaker/components/parts/SettingItem.vue';

const props = defineProps<{ modelValue: GiftCondition[] }>();
const emit = defineEmits<{ 'update:modelValue': [value: GiftCondition[]] }>();

// 選択肢の生成
const giftOptions = Object.entries(giftConditionLabels).map(([value, label]) => ({
 value: value as GiftCondition,
 label
}));

// オプションの切り替え
const toggleOption = (value: GiftCondition) => {
 const index = props.modelValue.indexOf(value);
 const newValue =
  index > -1 ? props.modelValue.filter((_, i) => i !== index) : [...props.modelValue, value];

 emit('update:modelValue', newValue);
};
</script>
