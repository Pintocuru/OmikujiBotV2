<!-- src/configMaker/components/RecordTabs/RuleFilter.vue -->
<template>
  <div role="alert" class="alert alert-info alert-outline">
    <!-- フィルター条件 -->
    <div class="px-4 py-2 space-y-2">
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
              : 'bg-base-100 border-base-300 hover:bg-base-200',
          ]"
        >
          すべて
        </button>
        <button
          v-for="color in store.getUniqueColors"
          :key="color"
          @click="store.filterOptions.colorFilter = store.filterOptions.colorFilter === color ? null : color"
          :class="[
            'flex items-center gap-2 px-3 py-1 text-xs rounded-full border transition-all',
            store.filterOptions.colorFilter === color
              ? 'bg-primary text-primary-content border-primary'
              : 'bg-base-100 border-base-300 hover:bg-base-200',
          ]"
        >
          <div class="w-3 h-3 rounded-full border border-white/20" :style="{ backgroundColor: color }" />
          <span class="font-mono">{{ color }}</span>
        </button>
      </div>

      <!-- 検索結果の統計と選択状態 -->
      <div class="mt-2 flex">
        <div class="mt-2 text-xs text-base-content/60">
          <span v-if="store.filterOptions.enabledOnly || store.filterOptions.colorFilter"
            >{{ store.filteredSortedItems.length }} /</span
          >
          {{ store.sortedItems.length }} 件のルールが表示されています
          <button
            v-if="store.filterOptions.enabledOnly || store.filterOptions.colorFilter"
            @click="clearSearch"
            class="ml-2 text-primary hover:text-primary-focus underline"
          >
            すべて表示
          </button>
        </div>

        <div>
          <!-- 複数選択モード切り替えボタン -->
          <button
            class="tab tab-bordered pl-4 pt-2 text-sm hover:bg-base-200 transition-all duration-200"
            @click="store.toggleMultiSelectMode"
            title="複数選択モード"
          >
            <span class="flex items-center gap-2">
              <input type="checkbox" class="checkbox checkbox-xs" :checked="store.isMultiSelectMode" readonly />
              複数選択モード
            </span>
          </button>
        </div>

        <!-- 選択状態の表示 -->
        <div v-if="store.isMultiSelectMode" class="pl-2 gap-4">
          {{ store.selectedRuleIds.size }}件選択中
          <button
            class="btn btn-sm btn-ghost"
            @click="store.selectAll"
            :disabled="store.selectedRuleIds.size === store.filteredSortedItems.length"
          >
            すべて選択
          </button>

          <button @click="store.clearSelection" class="btn btn-sm btn-ghost">選択解除</button>

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
  </div>
</template>

<script setup lang="ts">
  import { useRecordTabsStore } from './RecordTabsStore'

  // Store
  const store = useRecordTabsStore()

  // メソッド
  const clearSearch = () => {
    store.filterOptions.enabledOnly = false
    store.filterOptions.colorFilter = null
  }
</script>
