<!-- src/configMaker/components/ContentArea.vue -->
<template>
 <div class="card bg-base-200">
  <div class="card-title bg-primary text-lg p-2 pl-4 rounded-t flex items-center gap-2">
   <component :is="categoryLabels[selectedCategory].icon" class="w-5 h-5" />
   {{ categoryLabels[selectedCategory].label }}
  </div>

  <div class="card-body">
   <!-- コメントルール -->
   <CommentRuleEditor v-if="selectedCategory === 'comments'" />

   <!-- タイマールール -->
   <TimerRuleEditor v-else-if="selectedCategory === 'timers'" />

   <!-- プレースホルダー -->
   <PlaceholderEditor v-else-if="selectedCategory === 'placeholders'" />

   <!-- スクリプト設定 -->
   <ScriptSettingsEditor v-else-if="selectedCategory === 'scriptSettings'" />

   <!-- キャラクター設定 -->
   <CharacterEditor v-else-if="selectedCategory === 'characters'" />

   <!-- 表示設定 -->
   <DisplaySettingsEditor v-else-if="selectedCategory === 'displaySettings'" />

   <!-- WordParty設定 -->
   <WordPartySettingsEditor v-else-if="selectedCategory === 'wordPartySettings'" />

   <!-- フォールバック -->
   <div v-else>
    <p class="text-gray-600">不明なカテゴリ: {{ selectedCategory }}</p>
   </div>
  </div>
 </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { categoryLabels } from '@/types/';
import { useOmikujiStore } from '@ConfigStores/useOmikujiStore';
import CommentRuleEditor from '@ConfigComponents/rulesComments/CommentRuleEditor.vue';
import TimerRuleEditor from '@ConfigComponents/rulesTimers/TimerRuleEditor.vue';
import PlaceholderEditor from '@ConfigComponents/placeholders/PlaceholderEditor.vue';
import ScriptSettingsEditor from '@ConfigComponents/scriptSettings/ScriptSettingsEditor.vue';
import WordPartySettingsEditor from '@ConfigComponents/wordPartySettings/WordPartySettingsEditor.vue';
import CharacterEditor from '@ConfigComponents/characters/CharacterEditor.vue';
import DisplaySettingsEditor from '@ConfigComponents/displaySettings/DisplaySettingsEditor.vue';

const omikujiStore = useOmikujiStore();
const { selectedCategory } = storeToRefs(omikujiStore);
</script>
