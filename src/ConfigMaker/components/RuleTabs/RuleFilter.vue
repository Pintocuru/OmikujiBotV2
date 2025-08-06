<!-- src/configMaker/components/RuleTabs/RuleFilter.vue -->
<template>
 <div role="alert" class="alert alert-info alert-outline">
  <!-- フィルター条件 -->
  <div class="p-3 bg-base-200/50 rounded-lg">
   <div class="space-y-3">
    <div class="flex flex-wrap gap-4 items-center">
     <span class="text-sm font-medium">フィルター条件:</span>

     <!-- 有効/無効フィルター -->
     <div class="flex items-center gap-2">
      <label class="label cursor-pointer p-0">
       <input v-model="store.filterOptions.enabledOnly" type="checkbox" class="toggle toggle-sm" />
       <span class="label-text ml-2 text-sm">有効のみ</span>
      </label>
     </div>
    </div>

    <!-- カラーフィルター -->
    <div v-if="store.getUniqueColors.length > 0" class="flex flex-wrap items-center gap-2">
     <span class="text-sm font-medium">カラー:</span>
     <button
      @click="store.filterOptions.colorFilter = null"
      :class="[
       'px-3 py-1 text-xs rounded-full border transition-all',
       !store.filterOptions.colorFilter
        ? 'bg-primary text-primary-content border-primary'
        : 'bg-base-100 border-base-300 hover:bg-base-200'
      ]"
     >
      すべて
     </button>
     <button
      v-for="color in store.getUniqueColors"
      :key="color"
      @click="
       store.filterOptions.colorFilter = store.filterOptions.colorFilter === color ? null : color
      "
      :class="[
       'flex items-center gap-2 px-3 py-1 text-xs rounded-full border transition-all',
       store.filterOptions.colorFilter === color
        ? 'bg-primary text-primary-content border-primary'
        : 'bg-base-100 border-base-300 hover:bg-base-200'
      ]"
     >
      <div
       class="w-3 h-3 rounded-full border border-white/20"
       :style="{ backgroundColor: color }"
      />
      <span class="font-mono">{{ color }}</span>
     </button>
    </div>
   </div>
  </div>

  <!-- 検索結果の統計と選択状態 -->
  <div class="relative">
   <div class="mt-2 flex items-center justify-between text-xs text-base-content/60">
    <div>
     {{ store.filteredSortedRules.length }} /
     {{ store.sortedRules.length }} 件のルールが表示されています
     <button
      v-if="store.filterOptions.enabledOnly || store.filterOptions.colorFilter"
      @click="clearSearch"
      class="ml-2 text-primary hover:text-primary-focus underline"
     >
      すべて表示
     </button>
    </div>

    <!-- 選択状態の表示 -->
    <div v-if="store.selectedRuleIds.size > 0" class="flex items-center gap-2">
     <span class="text-primary font-medium">{{ store.selectedRuleIds.size }}件選択中</span>
     <button @click="store.clearSelection" class="text-primary hover:text-primary-focus underline">
      選択解除
     </button>
    </div>
   </div>
  </div>
 </div>
</template>

<script setup lang="ts">
import { useRuleTabsStore } from './RuleTabsStore';

// Store
const store = useRuleTabsStore();

// メソッド
const clearSearch = () => {
 store.filterOptions.enabledOnly = false;
 store.filterOptions.colorFilter = null;
};
</script>
