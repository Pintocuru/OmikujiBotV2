<!-- src/configMaker/components/characters/CharacterEditor.vue -->
<template>
 <!-- キャラクターがない場合 -->
 <div v-if="characterCount === 0" class="text-center py-8 text-gray-500">
  <Users class="w-12 h-12 mx-auto mb-2 opacity-50" />
  <p>キャラクターが設定されていません</p>
  <p class="text-sm">「新しいキャラクター」ボタンから追加してください</p>
 </div>

 <!-- キャラクタータブ（複数の場合） -->
 <RuleTabs :rules="charactersArray" :selectedRule="selectedCharacter" ruleType="characters" />

 <!-- 選択されたキャラクターの編集フォーム -->
 <div v-if="selectedCharacter">
  <!-- 基本情報 -->
  <CharacterBasicInfo v-model="selectedCharacter" />

  <!-- 色設定 -->
  <CharacterColorSettings v-model="selectedCharacter.color" />

  <!-- 表示設定 -->
  <CharacterIconDisplaySettings v-model="selectedCharacter.displayOption" />

  <!-- 枠指定設定 -->
  <CharacterServiceSettings
   v-if="selectedCharacter.displayOption.isOneCommePost"
   v-model="selectedCharacter"
  />

  <!-- 画像設定 -->
  <CharacterImageSettings
   v-if="selectedCharacter.displayOption.isIconDisplay"
   v-model="selectedCharacter.image"
   :id="selectedCharacter.id"
  />
 </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { CharacterType } from '@/types/';
import { useCharacterStore } from '@ConfigStores/useCharacterStore';
import { useOmikujiStore } from '@ConfigStores/useOmikujiStore';
import RuleTabs from '@ConfigComponents/RuleTabs/RuleTabs.vue';
import CharacterBasicInfo from './CharacterBasicInfo.vue';
import CharacterColorSettings from './CharacterColorSettings.vue';
import CharacterImageSettings from './CharacterImageSettings.vue';
import CharacterServiceSettings from './CharacterServiceSettings.vue';
import CharacterIconDisplaySettings from './CharacterIconDisplaySettings.vue';
import { Users } from 'lucide-vue-next';

// ストアを使用
const characterStore = useCharacterStore();
const omikujiStore = useOmikujiStore();

// 計算プロパティ
const charactersArray = computed(() => omikujiStore.getCategoryArray('characters'));
const characterCount = computed(() => Object.keys(charactersArray.value).length);

// v-modelを使用したselectedCharacterの実装
const selectedCharacter = computed({
 get: () => characterStore.selectedRule,
 set: (value: CharacterType) => {
  characterStore.update(value.id, value);
 }
});
</script>
