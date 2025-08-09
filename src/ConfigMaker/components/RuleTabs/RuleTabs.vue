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
import { RecordCategoryType } from '@/types/';
import { BaseTypes } from '@shared/types';
import { useRuleTabsStore } from './RuleTabsStore';

// Components
import RuleFilter from './RuleFilter.vue';
import RuleContextMenu from './RuleContextMenu.vue';
import RuleTabList from './RuleTabList.vue';
import { useOmikujiStore } from '@/ConfigMaker/stores/useOmikujiStore';

// Props
const props = defineProps<{
 rules: BaseTypes[];
 selectedRule: BaseTypes | null;
 ruleType: RecordCategoryType;
}>();

// Store
const omikujiStore = useOmikujiStore();
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
</script>
