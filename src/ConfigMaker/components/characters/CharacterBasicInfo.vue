<!-- src/configMaker/components/characters/CharacterBasicInfo.vue -->
<template>
 <div class="card bg-base-300 mt-4">
  <div class="card-title bg-secondary text-lg p-2 pl-4 rounded-t">
   <!-- カラーピッカー -->
   <ColorPicker v-model="localData.editorColor" />
   基本設定
  </div>

  <div class="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
   <!-- Key表示 -->
   <SettingItem
    label="Key"
    description="キャラクターのキー名"
    :showReset="false"
    containerClass="form-control"
   >
    <div class="flex gap-2 items-center">
     <div
      class="flex-grow px-4 py-2 rounded bg-base-200 text-gray-600 whitespace-nowrap overflow-x-auto"
     >
      {{ localData.id }}
     </div>
     <!-- 編集ボタン -->
     <IdEditor :currentId="localData.id" category="characters" />
    </div>
   </SettingItem>

   <!-- id以外のテキストフィールドループ -->
   <SettingItem
    v-for="field in fields"
    :key="field.key"
    :label="field.label"
    :description="field.description"
    :showReset="false"
    containerClass="form-control"
   >
    <input type="text" class="input input-bordered w-full" v-model="localData[field.key]" />
   </SettingItem>
  </div>
 </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { CharacterType } from '@/types/';
import IdEditor from '@ConfigComponents/parts/IdEditor.vue';
import ColorPicker from '@ConfigComponents/parts/ColorPicker.vue';
import SettingItem from '@ConfigComponents/parts/SettingItem.vue';

const props = defineProps<{
 modelValue: CharacterType;
}>();

const emit = defineEmits<{
 'update:modelValue': [value: CharacterType];
}>();

// 共通フィールド定義
const fields = [
 { key: 'name', label: '設定名', description: '識別しやすい名前' },
 { key: 'description', label: '説明', description: 'キャラクターの紹介文' },
 {
  key: 'displayName',
  label: 'ジェネレーターでの表示名',
  description: 'BOTちゃんで表示される名前'
 },
 { key: 'author', label: '作者', description: 'キャラクターの設定者名' },
 { key: 'url', label: 'Webサイト', description: 'キャラクターに関連するURL' }
] as const;

// v-modelを使用したlocalCharacterの実装
const localData = computed({
 get: () => props.modelValue,
 set: (value: CharacterType) => {
  emit('update:modelValue', value);
 }
});
</script>
