<!-- src/configMaker/components/characters/CharacterServiceSettings.vue -->
<template>
 <div class="card bg-base-300 mt-4">
  <div class="card-title bg-secondary text-lg p-2 pl-4 rounded-t">キャラクター用枠設定</div>

  <div class="flex flex-wrap gap-4 p-4">
   <!-- 補足説明 -->
   <div class="alert alert-info w-full">
    <Info class="w-5 h-5 mt-0.5 shrink-0" />
    <div class="space-y-1">
     <code class="label bg-accent text-accent-content">「BOTコメントをわんコメに投稿」</code
     >を有効にすると、自動的に「キャラクター用枠設定」も有効になります。<br />
     キャラクター専用の枠を作成すると、各キャラクターごとに
     <code class="label bg-accent text-accent-content">「読み上げ」設定</code
     >を個別に行うことができます。
    </div>
   </div>

   <!-- チェックボックス -->
   <SettingItem
    label="枠のID名"
    description="わんコメに同じIDの枠がなければ新規作成されます"
    containerClass="form-control"
    @reset="localData.frameId = localData.id"
   >
    <label class="label cursor-pointer justify-start gap-3">
     <input type="text" class="input input-bordered w-full" v-model="localData.frameId" />
    </label>
   </SettingItem>
  </div>
 </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { CharacterType } from '@/types/';
import SettingItem from '@ConfigComponents/parts/SettingItem.vue';
import { Info } from 'lucide-vue-next';

const props = defineProps<{
 modelValue: CharacterType;
}>();

const emit = defineEmits<{
 'update:modelValue': [value: CharacterType];
}>();

// v-modelを使用したlocalColorの実装
const localData = computed({
 get: () => props.modelValue,
 set: (value: CharacterType) => {
  emit('update:modelValue', value);
 }
});
</script>
