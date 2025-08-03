<!-- src/configMaker/components/characters/CharacterImageSettings.vue -->
<template>
 <div class="card bg-base-300 mt-4">
  <div class="card-title bg-secondary text-lg p-2 pl-4 rounded-t">画像設定</div>

  <!-- 補足説明 -->
  <div class="flex flex-wrap gap-4 p-4">
   <div class="alert alert-info w-full">
    <Info class="w-5 h-5 mt-0.5 shrink-0" />
    <div class="space-y-1">
     <p>
      画像ファイルは事前に
      <code class="label bg-accent text-accent-content"> Characters/[キャラクターID] </code>
      フォルダ内に配置してください。
     </p>
     <p>
      ファイル名は固定で、例：
      <code class="label bg-accent text-accent-content">default.png</code>、
      <code class="label bg-accent text-accent-content">happy.png</code>、
      <code class="label bg-accent text-accent-content">laughing.png</code>
      など12種類です。
     </p>
     <p>
      各項目の
      <button
       class="btn btn-ghost btn-xs px-1 py-0 h-auto min-h-0 text-xs"
       title="クリックでデフォルトパスを設定"
      >
       <RotateCcw class="w-3 h-3 mr-1" />
       リセット
      </button>
      ボタンで
      <code class="label bg-accent text-accent-content"> [キャラクターID]/[感情名].png </code>
      が自動設定されます。
     </p>
    </div>
   </div>
  </div>

  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 p-4">
   <div v-for="(emotion, key) in emotionLabels" :key="key" class="form-control">
    <SettingItem
     :label="emotion"
     :description="`(${key})`"
     containerClass="form-control flex-row items-center gap-2 mt-2"
     @reset="localImages[key] = `${id}/${key}.png`"
    >
     <input
      type="url"
      class="input input-bordered input-sm w-full"
      :placeholder="`${emotion}の画像URL`"
      v-model="localImages[key]"
     />

     <!-- プレビュー表示 -->
     <img
      v-if="localImages[key]"
      :src="getImagePath(localImages[key])"
      :alt="`${emotion}の画像プレビュー`"
      class="avatar max-h-24 rounded border"
      loading="lazy"
     />
    </SettingItem>
   </div>
  </div>
 </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { CharacterType, emotionLabels, getImagePath } from '@/types/';
import SettingItem from '@ConfigComponents/parts/SettingItem.vue';
import { Info, RotateCcw } from 'lucide-vue-next';

const props = defineProps<{
 modelValue: CharacterType['image'];
 id: string;
}>();

const emit = defineEmits<{
 'update:modelValue': [value: CharacterType['image']];
}>();

// v-modelを使用したlocalImagesの実装
const localImages = computed({
 get: () => props.modelValue,
 set: (value: CharacterType['image']) => {
  emit('update:modelValue', value);
 }
});
</script>
