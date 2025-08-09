<!-- src/configMaker/components/timers/TimerRuleEditor.vue -->
<template>
 <!-- タブ部分 -->
 <RecordTabs />

 <!-- ルール編集エリア -->
 <div v-if="selectedItem">
  <!-- 基本設定セクション -->
  <BaseSettingsEditor v-model="selectedItem" category="timers" />

  <!-- タイマー設定セクション -->
  <TimerIntervalEditor v-model="selectedItem" />

  <!-- おみくじ設定セクション -->
  <OmikujiSetEditor v-model="selectedItem.omikuji" category="timers" />
 </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { TimerRuleType } from '@/types/';
import TimerIntervalEditor from './TimerIntervalEditor.vue';
import OmikujiSetEditor from '@ConfigComponents/rules/OmikujiSetEditor.vue';
import RecordTabs from '@ConfigComponents/RecordTabs/RecordTabs.vue';
import BaseSettingsEditor from '@ConfigComponents/rules/BaseSettingsEditor.vue';
import { useOmikujiStore } from '@ConfigStores/useOmikujiStore';
import { storeToRefs } from 'pinia';

// ストアを使用
const omikujiStore = useOmikujiStore();
const { data, selectedRuleId } = storeToRefs(omikujiStore);

const selectedItem = computed({
 get: () => {
  if (!selectedRuleId.value) return null;
  // 明示的に型キャストして readonly を外す
  return data.value.timers[selectedRuleId.value] as TimerRuleType;
 },
 set: (value: TimerRuleType) => {
  omikujiStore.updateItem('characters', value.id, value);
 }
});
</script>
