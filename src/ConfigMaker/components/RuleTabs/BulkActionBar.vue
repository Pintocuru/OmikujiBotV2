<!-- src/configMaker/components/RuleTabs/BulkActionBar.vue -->
<!-- ! 削除予定 -->
<template>
 <div class="bg-primary/10 p-3 rounded-lg border border-primary/20">
  <div class="flex items-center justify-between">
   <span class="text-sm font-medium">{{ store.selectedRuleIds.size }}件選択中</span>
   <div class="flex gap-2">
    <button
     class="btn btn-sm btn-ghost"
     @click="store.selectAll"
     :disabled="store.selectedRuleIds.size === store.filteredSortedItems.length"
    >
     すべて選択
    </button>
    <button class="btn btn-sm btn-ghost" @click="store.clearSelection">選択解除</button>
    <button
     class="btn btn-sm btn-error"
     @click="store.handleBulkDelete"
     :disabled="store.selectedRuleIds.size === 0"
    >
     選択したルールを削除
    </button>
   </div>
  </div>
 </div>
</template>

<script setup lang="ts">
import { useRuleTabsStore } from './RuleTabsStore';

// Store
const store = useRuleTabsStore();
</script>
