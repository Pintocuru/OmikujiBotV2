<!-- src/configMaker/components/RuleTabs/RuleTabs.vue -->
<template>
 <div class="space-y-4">
  <!-- フィルターコンポーネント -->
  <RuleFilter />

  <!-- 複数選択モード時の一括操作バー -->
  <BulkActionBar v-if="store.isMultiSelectMode" />

  <!-- タブ部分 -->
  <RuleTabList />

  <!-- フィルター結果が空の場合のメッセージ -->
  <div v-if="store.filterOptions.query && store.filteredSortedRules.length === 0">
   <div class="text-center py-8">
    <div class="text-base-content/60">
     <p class="text-lg mb-2">
      「{{ store.filterOptions.query }}」に一致するルールが見つかりませんでした
     </p>
     <p class="text-sm">検索条件を変更するか、新しいルールを追加してください</p>
    </div>
   </div>
  </div>

  <!-- 右クリックコンテキストメニュー -->
  <RuleContextMenu />
 </div>
</template>

<script setup lang="ts">
import { watch, onMounted } from 'vue';
import { CategoryType } from '@/types/';
import { BaseTypes } from '@shared/types';
import { useRuleTabsStore } from './RuleTabsStore';

// Components
import RuleFilter from './RuleFilter.vue';
import RuleContextMenu from './RuleContextMenu.vue';
import BulkActionBar from './BulkActionBar.vue';
import RuleTabList from './RuleTabList.vue';

// Props
const props = defineProps<{
 rules: BaseTypes[];
 selectedRule: BaseTypes | null;
 ruleType: CategoryType;
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
