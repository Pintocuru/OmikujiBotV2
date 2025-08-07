<!-- src/configMaker/components/comments/BaseSettingsEditor.vue -->
<template>
 <div class="card bg-base-300 mt-4">
  <!-- ヘッダー -->
  <div class="card-title bg-secondary text-lg p-2 pl-4 rounded-t flex items-center justify-between">
   <div class="flex items-center gap-2">
    <!-- カラーピッカー -->
    <ColorPicker v-model="editorColor" />
    <span>基本設定</span>
   </div>
   <label class="cursor-pointer flex items-center gap-2">
    <input type="checkbox" v-model="isEnabled" class="toggle toggle-primary" />
    <span class="text-sm">ルールを有効にする</span>
   </label>
  </div>

  <!-- ボディ -->
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
   <!-- ID表示(開発モード専用) -->
   <div
    v-if="data.displaySettings.developer.godModeEnabled"
    class="p-2 bg-warning text-warning-content rounded-md"
   >
    <SettingItem
     label="ID"
     description="Q.なぜ変更できる? A.データの見た目が良くなる"
     :showReset="false"
     containerClass="form-control"
    >
     <div class="flex gap-2 items-center">
      <div class="w-full px-4 py-2 rounded bg-base-200 text-gray-600 break-all">
       {{ id }}
      </div>
      <!-- 編集ボタン -->
      <IdEditor :currentId="id" :category="category" />
     </div>
    </SettingItem>
   </div>
   <SettingItem
    label="ルール名"
    description="識別しやすい名前"
    :showReset="false"
    containerClass="form-control"
   >
    <input type="text" v-model="name" class="input input-bordered w-full" />
   </SettingItem>

   <SettingItem
    label="説明"
    description="ルールの紹介文"
    :showReset="false"
    containerClass="form-control"
   >
    <input type="text" v-model="description" class="input input-bordered w-full" />
   </SettingItem>
  </div>
 </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { RuleType, SelectCategoryType, isDev } from '@/types/';
import ColorPicker from '@ConfigComponents/parts/ColorPicker.vue';
import SettingItem from '@ConfigComponents/parts/SettingItem.vue';
import IdEditor from '@ConfigComponents/parts/IdEditor.vue';
import { useOmikujiStore } from '@ConfigStore/useOmikujiStore';
import { storeToRefs } from 'pinia';

const props = defineProps<{
 modelValue: RuleType;
 category: SelectCategoryType;
}>();

const emit = defineEmits<{
 'update:modelValue': [value: RuleType];
}>();

// Store
const omikujiStore = useOmikujiStore();
const { data } = storeToRefs(omikujiStore);

// 各プロパティのcomputed getter/setter
const createComputed = <T extends keyof RuleType>(key: T) =>
 computed({
  get: () => props.modelValue[key],
  set: (value) => emit('update:modelValue', { ...props.modelValue, [key]: value })
 });

const id = createComputed('id');
const name = createComputed('name');
const description = createComputed('description');
const isEnabled = createComputed('isEnabled');
const editorColor = createComputed('editorColor');
</script>
