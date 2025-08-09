<!-- src/configMaker/components/comments/CommentRuleEditor.vue -->
<template>
 <!-- タブ部分 -->
 <RecordTabs
  :rules="rulesArray"
  :selectedRule="selectedRule"
  ruleType="comments"
  :external-store="extendedStore"
 />

 <!-- ルール編集エリア -->
 <div v-if="selectedRule">
  <!-- 基本設定セクション -->
  <BaseSettingsEditor v-model="selectedRule" category="comments" />

  <!-- 条件設定セクション -->
  <CommentThresholdEditor v-model="selectedRule.threshold" />

  <!-- ゲームスクリプト設定セクション -->
  <ScriptGameEditor v-model="selectedRule" />

  <!-- おみくじ制限設定セクション -->
  <OmikujiLimitsEditor v-model="selectedRule.limits" />

  <!-- おみくじ設定セクション -->
  <OmikujiSetEditor v-model="selectedRule.omikuji" category="comments" />
 </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { CommentRuleType, RuleType } from '@/types/';
import BaseSettingsEditor from '../rules/BaseSettingsEditor.vue';
import ScriptGameEditor from './GameScriptEditor.vue';
import OmikujiSetEditor from '../rules/OmikujiSetEditor.vue';
import OmikujiLimitsEditor from '@ConfigComponents/limit/OmikujiLimitsEditor.vue';
import CommentThresholdEditor from '@ConfigComponents/threshold/ThresholdEditor.vue';
import RecordTabs from '@ConfigComponents/RecordTabs/RecordTabs.vue';
import { useCommentRulesStore } from '@ConfigStores/useCommentRulesStore';
import { useOmikujiStore } from '@ConfigStores/useOmikujiStore';

// ストアを使用
const commentRulesStore = useCommentRulesStore();
const omikujiStore = useOmikujiStore();

// RecordTabsコンポーネントで使用するstore機能を拡張
const extendedStore = {
 ...commentRulesStore,
 selectRule: (ruleId: string) => {
  omikujiStore.selectCategory('comments');
  omikujiStore.selectRule(ruleId);
 }
};

// computed
const selectedRule = computed({
 get: () => commentRulesStore.selectedRule,
 set: (newValue: RuleType) => {
  if (commentRulesStore.selectedRule && commentRulesStore.selectedRule.id) {
   commentRulesStore.update(commentRulesStore.selectedRule.id, newValue as CommentRuleType);
  }
 }
});
const rulesArray = computed(() => commentRulesStore.rulesArray);
</script>
