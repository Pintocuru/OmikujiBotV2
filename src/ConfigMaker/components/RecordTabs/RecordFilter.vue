<!-- src/configMaker/components/RecordTabs/RuleFilter.vue -->
<template>
  <div role="alert" class="alert alert-info alert-outline">
    <div class="px-4 py-2 space-y-2">
      <!-- カラーフィルター -->
      <div
        v-if="store.getUniqueColors.length > 0 && store.filterOptions.tagFilter === null"
        class="flex flex-wrap items-center gap-2"
      >
        <span class="text-sm font-medium">カラー:</span>
        <button
          @click="store.setColorFilter(null)"
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
          @click="store.setColorFilter(store.filterOptions.colorFilter === color ? null : color)"
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

      <!-- タグフィルター -->
      <div
        v-if="store.getUniqueTags.length > 0 && store.filterOptions.colorFilter === null"
        class="flex flex-wrap items-center gap-2"
      >
        <span class="text-sm font-medium">タグ:</span>
        <button
          @click="store.setTagFilter(null)"
          :class="[
            'px-3 py-1 text-xs rounded-full border transition-all',
            !store.filterOptions.tagFilter
              ? 'bg-primary text-primary-content border-primary'
              : 'bg-base-100 border-base-300 hover:bg-base-200',
          ]"
        >
          すべて
        </button>
        <button
          v-for="tag in store.getUniqueTags"
          :key="tag"
          @click="store.setTagFilter(store.filterOptions.tagFilter === tag ? null : tag)"
          :class="[
            'px-3 py-1 text-xs rounded-full border transition-all',
            store.filterOptions.tagFilter === tag
              ? 'bg-primary text-primary-content border-primary'
              : 'bg-base-100 border-base-300 hover:bg-base-200',
          ]"
        >
          <span class="font-medium">#{{ tag }}</span>
        </button>
      </div>

      <!-- 検索結果の統計とフィルター情報 -->
      <div class="flex flex-col gap-2">
        <!-- 統計情報 -->
        <div class="flex gap-4 items-center">
          <div class="text-xs text-base-content/60">
            <span v-if="store.isFilterActive">{{ store.filteredSortedItems.length }} /</span>
            {{ store.sortedItems.length }} 件のルールが表示されています
            <button
              v-if="store.isFilterActive"
              @click="clearSearch"
              class="ml-2 text-primary hover:text-primary-focus underline"
            >
              すべて表示
            </button>
          </div>

          <!-- 複数選択モード切り替えボタン -->
          <button
            class="tab tab-bordered pt-2 text-sm hover:bg-base-200 transition-all duration-200"
            @click="store.toggleMultiSelectMode()"
            title="複数選択モード"
          >
            <span class="flex items-center gap-2">
              <input type="checkbox" class="checkbox checkbox-xs" :checked="store.isMultiSelectMode" readonly />
              複数選択モード
            </span>
          </button>

          <!-- 選択状態の表示 -->
          <template v-if="store.isMultiSelectMode">
            <div class="text-base-content/60">{{ store.selectedRuleIds.size }}件選択中</div>
            <button
              class="btn btn-sm btn-primary"
              @click="store.selectAll"
              :disabled="store.selectedRuleIds.size === store.filteredSortedItems.length"
            >
              すべて選択
            </button>

            <button @click="store.clearSelection" class="btn btn-sm btn-secondary">選択解除</button>
          </template>
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
    store.resetFilterOptions()
  }
</script>
