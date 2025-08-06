<!-- src/configMaker/components/RuleTabs/RuleTabs.vue -->
<template>
 <div class="space-y-4">
  <!-- フィルターコンポーネント -->
  <RuleFilter />

  <!-- タブ部分 -->
  <RuleTabList />

  <!-- 右クリックコンテキストメニュー -->
  <RuleContextMenu />
 </div>
</template>

<script setup lang="ts">
import { watch, onMounted } from 'vue';
import { SelectCategoryType } from '@/types/';
import { BaseTypes } from '@shared/types';
import { useRuleTabsStore } from './RuleTabsStore';

// Components
import RuleFilter from './RuleFilter.vue';
import RuleContextMenu from './RuleContextMenu.vue';
import RuleTabList from './RuleTabList.vue';

// Props
const props = defineProps<{
 rules: BaseTypes[];
 selectedRule: BaseTypes | null;
 ruleType: SelectCategoryType;
 externalStore: any;
}>();

// Store
const store = useRuleTabsStore();

// ストアの初期化
onMounted(() => {
 store.initializeStore(props.ruleType, props.rules, props.selectedRule, props.externalStore);
});

// プロパティの変更を監視してストアを更新
watch(
 [() => props.rules, () => props.selectedRule],
 ([newRules, newSelected]) => {
  store.updateRulesData(newRules, newSelected);
 },
 { deep: true }
);

// 外部ストアの変更を監視
watch(
 () => props.externalStore,
 (newStore) => {
  store.initializeStore(props.ruleType, props.rules, props.selectedRule, newStore);
 }
);
</script>
