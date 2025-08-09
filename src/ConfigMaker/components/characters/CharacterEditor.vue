<!-- src/configMaker/components/characters/CharacterEditor.vue -->
<template>
 <!-- タブ -->
 <RecordTabs />

 <!-- 選択されたキャラクターの編集フォーム -->
 <div v-if="selectedItem">
  <!-- 基本情報 -->
  <CharacterBasicInfo v-model="selectedItem" />

  <!-- 色設定 -->
  <CharacterColorSettings v-model="selectedItem.color" />

  <!-- 表示設定 -->
  <CharacterIconDisplaySettings v-model="selectedItem.displayOption" />

  <!-- 枠指定設定 -->
  <CharacterServiceSettings
   v-if="selectedItem.displayOption.isOneCommePost"
   v-model="selectedItem"
  />

  <!-- 画像設定 -->
  <CharacterImageSettings
   v-if="selectedItem.displayOption.isIconDisplay"
   v-model="selectedItem.image"
   :id="selectedItem.id"
  />
 </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { CharacterType } from '@/types/';
import { useOmikujiStore } from '@ConfigStores/useOmikujiStore';
import RecordTabs from '@ConfigComponents/RecordTabs/RecordTabs.vue';
import CharacterBasicInfo from './CharacterBasicInfo.vue';
import CharacterColorSettings from './CharacterColorSettings.vue';
import CharacterImageSettings from './CharacterImageSettings.vue';
import CharacterServiceSettings from './CharacterServiceSettings.vue';
import CharacterIconDisplaySettings from './CharacterIconDisplaySettings.vue';
import { storeToRefs } from 'pinia';

// ストアを使用
const omikujiStore = useOmikujiStore();
const { data, selectedRuleId } = storeToRefs(omikujiStore);

// v-modelを使用したselectedCharacterの実装
const selectedItem = computed({
 get: () => {
  if (!selectedRuleId.value) return null;
  return data.value.characters[selectedRuleId.value];
 },
 set: (value: CharacterType) => {
  omikujiStore.updateItem('characters', value.id, value);
 }
});
</script>
