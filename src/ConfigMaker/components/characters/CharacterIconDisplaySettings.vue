<!-- src/configMaker/components/characters/CharacterIconDisplaySettings.vue -->
<template>
 <div class="card bg-base-300 mt-4">
  <div class="card-title bg-secondary text-lg p-2 pl-4 rounded-t">キャラクター表示設定</div>

  <div class="card-body gap-4 p-4">
   <!-- isIconDisplay  -->
   <SettingItem
    label="キャラクター表示"
    description="ONで画像とフキダシを表示、OFFでフキダシのみ表示"
    :showReset="false"
    containerClass="form-control flex-row items-center gap-2 mt-2"
   >
    <label class="label cursor-pointer justify-start gap-3">
     <input type="checkbox" class="checkbox checkbox-primary" v-model="localData.isIconDisplay" />
     <span class="label-text font-medium">有効にするとアイコン画像の設定が可能になります</span>
    </label>
   </SettingItem>

   <!-- isOneCommePost -->
   <SettingItem
    label="BOTコメントをわんコメに投稿"
    description="わんコメにBOTコメントとして表示させるか"
    :showReset="false"
    containerClass="form-control flex-row items-center gap-2 mt-2"
   >
    <label class="label cursor-pointer justify-start gap-3">
     <input type="checkbox" class="checkbox checkbox-primary" v-model="localData.isOneCommePost" />
     <span class="label-text font-medium"
      >有効にすると「キャラクター用枠設定」の設定ができます</span
     >
    </label>
   </SettingItem>

   <!-- isVoice  -->
   <SettingItem
    label="BOTコメントの読み上げ"
    description="BOTコメントをわんコメで鳴らすか"
    :showReset="false"
    containerClass="form-control flex-row items-center gap-2 mt-2"
   >
    <label class="label cursor-pointer justify-start gap-3">
     <input
      :disabled="localData.isOneCommePost"
      type="checkbox"
      class="checkbox checkbox-primary"
      v-model="localData.isVoice"
     />
     <span class="label-text font-medium"
      >「BOTコメントをわんコメに投稿」がONの場合、そちらが優先されます。<br />読み上げの声は「わんコメの標準設定」が使われます</span
     >
    </label>
   </SettingItem>
  </div>
 </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { DisplayOptionType } from '@/types/';
import SettingItem from '@ConfigComponents/parts/SettingItem.vue';

const props = defineProps<{
 modelValue: DisplayOptionType;
}>();

const emit = defineEmits<{
 'update:modelValue': [value: DisplayOptionType];
}>();

// v-modelを使用したlocalColorの実装
const localData = computed({
 get: () => props.modelValue,
 set: (value: DisplayOptionType) => {
  emit('update:modelValue', value);
 }
});
</script>
