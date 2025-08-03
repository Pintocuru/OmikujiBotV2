<!-- src/configMaker/components/RuleTabs/RuleFilter.vue -->
<template>
 <div class="mb-4">
  <div class="relative">
   <!-- 検索入力フィールド -->
   <div class="relative flex items-center">
    <Search class="absolute left-3 w-4 h-4 text-base-content/50 pointer-events-none" />
    <input
     v-model="searchQuery"
     type="text"
     placeholder="ルール名や説明で検索..."
     class="input input-bordered w-full pl-10 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
     @keyup.escape="clearSearch"
    />

    <!-- クリアボタン -->
    <button
     v-if="searchQuery"
     @click="clearSearch"
     class="absolute right-3 p-1 hover:bg-base-200 rounded-full transition-colors"
     title="検索をクリア"
    >
     <X class="w-4 h-4 text-base-content/50 hover:text-base-content" />
    </button>
   </div>

   <!-- 検索結果の統計 -->
   <div
    v-if="searchQuery || enabledFilter || colorFilter"
    class="mt-2 text-xs text-base-content/60"
   >
    {{ filteredCount }} / {{ totalCount }} 件のルールが表示されています
    <button @click="clearSearch" class="ml-2 text-primary hover:text-primary-focus underline">
     すべて表示
    </button>
   </div>
  </div>

  <!-- フィルター条件 -->
  <div v-if="showAdvancedFilters" class="mt-3 p-3 bg-base-200/50 rounded-lg">
   <div class="space-y-3">
    <div class="flex flex-wrap gap-4 items-center">
     <span class="text-sm font-medium">フィルター条件:</span>

     <!-- 有効/無効フィルター -->
     <div class="flex items-center gap-2">
      <label class="label cursor-pointer p-0">
       <input v-model="enabledFilter" type="checkbox" class="checkbox checkbox-sm" />
       <span class="label-text ml-2 text-sm">有効のみ</span>
      </label>
     </div>

     <!-- 検索対象 -->
     <div class="flex items-center gap-2">
      <span class="text-sm">検索対象:</span>
      <label class="label cursor-pointer p-0">
       <input v-model="searchInName" type="checkbox" class="checkbox checkbox-sm" />
       <span class="label-text ml-1 text-sm">名前</span>
      </label>
      <label class="label cursor-pointer p-0">
       <input v-model="searchInDescription" type="checkbox" class="checkbox checkbox-sm" />
       <span class="label-text ml-1 text-sm">説明</span>
      </label>
     </div>
    </div>

    <!-- カラーフィルター -->
    <div v-if="availableColors.length > 0" class="flex flex-wrap items-center gap-2">
     <span class="text-sm font-medium">カラー:</span>
     <button
      @click="colorFilter = null"
      :class="[
       'px-3 py-1 text-xs rounded-full border transition-all',
       !colorFilter
        ? 'bg-primary text-primary-content border-primary'
        : 'bg-base-100 border-base-300 hover:bg-base-200'
      ]"
     >
      すべて
     </button>
     <button
      v-for="color in availableColors"
      :key="color"
      @click="colorFilter = colorFilter === color ? null : color"
      :class="[
       'flex items-center gap-2 px-3 py-1 text-xs rounded-full border transition-all',
       colorFilter === color
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

  <!-- 詳細フィルター切り替え -->
  <div class="mt-2 flex justify-end">
   <button
    @click="showAdvancedFilters = !showAdvancedFilters"
    class="text-xs text-base-content/60 hover:text-base-content transition-colors flex items-center gap-1"
   >
    {{ showAdvancedFilters ? '詳細フィルターを隠す' : '詳細フィルター' }}
    <ChevronDown
     class="w-3 h-3 transition-transform"
     :class="{ 'rotate-180': showAdvancedFilters }"
    />
   </button>
  </div>
 </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { Search, X, ChevronDown } from 'lucide-vue-next';

// Types
import type { FilterOptions } from './RuleTabsTypes';

// Props
const props = defineProps<{
 modelValue: string;
 totalCount: number;
 filteredCount: number;
 availableColors: string[];
}>();

// Emits
const emit = defineEmits<{
 'update:modelValue': [value: string];
 'filter-change': [filters: FilterOptions];
}>();

// リアクティブデータ
const searchQuery = ref(props.modelValue);
const showAdvancedFilters = ref(false);
const enabledFilter = ref(false);
const searchInName = ref(true);
const searchInDescription = ref(true);
const colorFilter = ref<string | null>(null);

// 計算プロパティ
const currentFilters = computed(
 (): FilterOptions => ({
  query: searchQuery.value,
  enabledOnly: enabledFilter.value,
  searchInName: searchInName.value,
  searchInDescription: searchInDescription.value,
  colorFilter: colorFilter.value
 })
);

// ウォッチャー
watch(searchQuery, (newValue) => {
 emit('update:modelValue', newValue);
});

watch(
 currentFilters,
 (newFilters) => {
  emit('filter-change', newFilters);
 },
 { deep: true }
);

watch(
 () => props.modelValue,
 (newValue) => {
  searchQuery.value = newValue;
 }
);

// メソッド
const clearSearch = () => {
 searchQuery.value = '';
 enabledFilter.value = false;
 searchInName.value = true;
 searchInDescription.value = true;
 colorFilter.value = null;
};

// 検索対象の最低一つは選択されている状態を保持
watch([searchInName, searchInDescription], ([name, description]) => {
 if (!name && !description) {
  searchInName.value = true;
 }
});
</script>

<style scoped>
.input:focus {
 border-color: hsl(var(--p));
}
</style>
