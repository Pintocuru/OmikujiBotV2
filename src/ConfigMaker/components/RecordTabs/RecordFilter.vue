<!-- src/ConfigMaker/components/RecordTabs/RecordFilter.vue -->
<template>
  <div class="alert alert-info alert-outline">
    <div class="p-2 space-y-2">
      <!-- カラーフィルター -->
      <div
        v-if="store.getUniqueColors.length > 0 && store.filterOptions.tagFilter === null"
        class="flex flex-wrap items-center gap-2"
      >
        <span class="text-sm font-medium">カラー:</span>

        <!-- すべて -->
        <button
          @click="store.setColorFilter(null)"
          :class="[filterBtnBase, store.filterOptions.colorFilter === null ? activeBtn : inactiveBtn]"
        >
          すべて
        </button>

        <!-- 個別カラー -->
        <button
          v-for="color in store.getUniqueColors"
          :key="color"
          @click="store.setColorFilter(store.filterOptions.colorFilter === color ? null : color)"
          :class="[filterBtnBase, store.filterOptions.colorFilter === color ? activeBtn : inactiveBtn]"
        >
          <div class="w-3 h-3 rounded-full border border-base-content/20" :style="{ backgroundColor: color }" />
          <span class="font-mono">{{ color }}</span>
        </button>
      </div>

      <!-- タグフィルター -->
      <div
        v-if="store.getUniqueTags.length > 0 && store.filterOptions.colorFilter === null"
        class="flex flex-wrap items-center gap-2"
      >
        <span class="text-sm font-medium">タグ:</span>

        <!-- すべて -->
        <button
          @click="store.setTagFilter(null)"
          :class="[filterBtnBase, store.filterOptions.tagFilter === null ? activeBtn : inactiveBtn]"
        >
          すべて
        </button>

        <!-- 個別タグ -->
        <button
          v-for="tag in store.getUniqueTags"
          :key="tag"
          @click="store.setTagFilter(store.filterOptions.tagFilter === tag ? null : tag)"
          :class="[filterBtnBase, store.filterOptions.tagFilter === tag ? activeBtn : inactiveBtn]"
        >
          <span class="font-medium">#{{ tag }}</span>
        </button>
      </div>

      <!-- 統計とフィルター情報 -->
      <div class="flex flex-col gap-2">
        <div class="flex items-center gap-4">
          <!-- 統計 -->
          <div class="text-xs text-base-content/60">
            <span v-if="store.isFilterActive">{{ store.filteredSortedItems.length }} /</span>
            {{ store.sortedItems.length }} 件のイベントが表示されています

            <button
              v-if="store.isFilterActive"
              @click="clearSearch"
              class="ml-2 text-primary hover:text-primary-focus underline"
            >
              すべて表示
            </button>
          </div>

          <!-- 複数選択モード -->
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

          <!-- 選択状態 -->
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

  const store = useRecordTabsStore()

  // 共通クラス
  const filterBtnBase = 'badge cursor-pointer'

  // 状態別クラス
  const activeBtn = 'badge-primary'
  const inactiveBtn = 'badge-outline hover:bg-primary'

  // メソッド
  const clearSearch = () => {
    store.resetFilterOptions()
  }
</script>
