<!-- src/configMaker/components/timers/TimerRuleEditor.vue -->
<template>
 <!-- タブ部分 -->
 <RecordTabs
  :rules="rulesArray"
  :selectedRule="selectedRule"
  ruleType="timers"
  :external-store="extendedStore"
 />

 <!-- ルール編集エリア -->
 <div v-if="selectedRule">
  <!-- 基本設定セクション -->
  <BaseSettingsEditor v-model="selectedRule" category="timers" />

  <!-- タイマー設定セクション -->
  <TimerIntervalEditor v-model="selectedRule" />

  <!-- おみくじ設定セクション -->
  <OmikujiSetEditor v-model="selectedRule.omikuji" category="timers" />
 </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { RuleType, TimerRuleType } from '@/types/';
import TimerIntervalEditor from './TimerIntervalEditor.vue';
import OmikujiSetEditor from '@ConfigComponents/rules/OmikujiSetEditor.vue';
import RecordTabs from '@ConfigComponents/RecordTabs/RecordTabs.vue';
import BaseSettingsEditor from '@ConfigComponents/rules/BaseSettingsEditor.vue';
import { useTimerRulesStore } from '@ConfigStores/useTimerRulesStore';
import { useOmikujiStore } from '@ConfigStores/useOmikujiStore';

// ストアを使用
const timerRulesStore = useTimerRulesStore();
const omikujiStore = useOmikujiStore();
// TODO: 不要なstore
// RecordTabsコンポーネントで使用するstore機能を拡張
const extendedStore = {
 ...timerRulesStore,
 selectRule: (ruleId: string) => {
  omikujiStore.selectCategory('timers');
  omikujiStore.selectRule(ruleId);
 }
};

// computed
const selectedRule = computed({
 get: () => timerRulesStore.selectedRule,
 set: (newValue: RuleType) => {
  if (timerRulesStore.selectedRule && timerRulesStore.selectedRule.id) {
   timerRulesStore.update(timerRulesStore.selectedRule.id, newValue as TimerRuleType);
  }
 }
});
const rulesArray = computed(() => timerRulesStore.rulesArray);
</script>
