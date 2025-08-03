<!-- src/configMaker/components/comments/OmikujiLimitsEditor.vue -->
<template>
 <div class="card bg-base-300 mt-4">
  <div class="card-title bg-secondary text-lg p-2 pl-4 rounded-t flex items-center justify-between">
   <div class="flex items-center gap-2">
    <span>おみくじ制限設定</span>
   </div>
  </div>

  <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4">
   <SettingItem
    label="クールダウン時間"
    description="おみくじを引けるようになるまでの秒数 (0で無効)"
    :showReset="true"
    @reset="processCooldownSeconds = 3"
   >
    <input
     type="number"
     v-model.number="processCooldownSeconds"
     min="0"
     max="300"
     class="input input-bordered w-full"
    />
   </SettingItem>

   <SettingItem
    label="引ける回数"
    description="今回のおみくじを引ける最大回数 (0で無制限)"
    :showReset="true"
    @reset="drawLimit = 0"
   >
    <input type="number" v-model.number="drawLimit" min="0" class="input input-bordered w-full" />
   </SettingItem>

   <SettingItem
    label="連投を許可"
    description="続けておみくじを引くことを許可するか"
    :showReset="true"
    @reset="isRepeatAllowed = true"
   >
    <input type="checkbox" v-model="isRepeatAllowed" class="toggle toggle-primary" />
   </SettingItem>
  </div>
 </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { OmikujiLimitsType } from '@/types/';
import SettingItem from '@ConfigComponents/parts/SettingItem.vue';

const props = defineProps<{
 modelValue: OmikujiLimitsType;
}>();

const emit = defineEmits<{
 'update:modelValue': [value: OmikujiLimitsType];
}>();

// 各プロパティのcomputed getter/setter
const createComputed = <T extends keyof OmikujiLimitsType>(key: T) =>
 computed({
  get: () => props.modelValue[key],
  set: (value) => emit('update:modelValue', { ...props.modelValue, [key]: value })
 });

const processCooldownSeconds = createComputed('processCooldownSeconds');
const drawLimit = createComputed('drawLimit');
const isRepeatAllowed = createComputed('isRepeatAllowed');
</script>
