<!-- src/configMaker/components/presets/ConfigImportModal.vue -->
<template>
  <!-- インポートプレビューモーダル -->
  <div class="modal modal-open">
    <div class="modal-box max-w-2xl">
      <h3 class="font-bold text-lg text-primary mb-4">設定読み込みプレビュー</h3>

      <div v-if="previewData" class="space-y-4">
        <!-- 概要 -->
        <div class="bg-base-200 p-4 rounded-lg">
          <div class="flex items-center gap-2 mb-2">
            <span class="font-medium">📊 読み込み概要</span>
          </div>
          <div class="grid grid-cols-2 gap-4 text-sm">
            <div>総項目数: {{ previewData.totalItems }}</div>
            <div v-if="previewData.hasConflicts" class="text-warning">⚠️ 競合項目があります</div>
          </div>
        </div>

        <!-- カテゴリ別設定 -->
        <div class="space-y-3">
          <h4 class="font-medium">カテゴリ別読み込み設定</h4>

          <div
            v-for="(config, category) in previewData.categories"
            :key="category"
            class="border border-base-300 rounded-lg p-3"
          >
            <div class="flex items-center justify-between mb-2">
              <div class="flex items-center gap-2">
                <input
                  type="checkbox"
                  :checked="config.enabled"
                  @change="handleCategoryEnabledChange(category, $event)"
                  class="checkbox checkbox-sm"
                />
                <span class="font-medium">{{ getCategoryDisplayName(category) }}</span>
                <span class="badge badge-sm">{{ config.count }}項目</span>
              </div>
            </div>

            <div v-if="config.enabled" class="ml-6 space-y-2">
              <!-- 読み込みモード選択 -->
              <div class="flex items-center gap-4">
                <span class="text-sm">読み込み方法:</span>
                <div class="flex gap-2">
                  <label class="flex items-center gap-1">
                    <input
                      type="radio"
                      :name="`mode-${category}`"
                      value="replace"
                      :checked="config.mode === 'replace'"
                      @change="handleCategoryModeChange(category, 'replace')"
                      class="radio radio-sm"
                    />
                    <span class="text-sm">置き換え</span>
                  </label>
                  <label class="flex items-center gap-1">
                    <input
                      type="radio"
                      :name="`mode-${category}`"
                      value="merge"
                      :checked="config.mode === 'merge'"
                      @change="handleCategoryModeChange(category, 'merge')"
                      class="radio radio-sm"
                    />
                    <span class="text-sm">マージ</span>
                  </label>
                </div>
              </div>

              <!-- 競合項目の表示 -->
              <div v-if="config.conflicts.length > 0" class="text-sm">
                <div class="text-warning pb-1">競合項目 ({{ config.conflicts.length }}件):</div>
                <div class="max-h-25 overflow-y-auto">
                  <span
                    v-for="conflictKey in config.conflicts"
                    :key="conflictKey.key"
                    class="inline-block bg-warning bg-opacity-20 text-warning-content px-2 py-1 rounded mr-1 mb-1"
                  >
                    {{ conflictKey.key }}
                    <span v-if="conflictKey.name && conflictKey.name !== ''">({{ conflictKey.name }})</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- モード説明 -->
        <div class="bg-info bg-opacity-10 p-3 rounded-lg text-sm">
          <div class="font-medium mb-2">📝 読み込みモード説明</div>
          <ul class="space-y-1 text-xs">
            <li><strong>置き換え:</strong> カテゴリ全体を新しい設定で置き換え</li>
            <li><strong>マージ:</strong> 既存設定に新しい設定を追加・上書き</li>
            <li><strong>追加のみ:</strong> 重複しない項目のみ追加</li>
          </ul>
        </div>
      </div>
      <!-- previewData が null の場合の表示 -->
      <div v-else class="text-center py-8">
        <div class="text-gray-500">プレビューデータを読み込み中...</div>
      </div>

      <ModalFooterActions
        :on-cancel="() => $emit('cancel')"
        :on-save="() => $emit('confirm')"
        :saveName="'読み込み実行'"
        :disabled="!hasEnabledCategories || !previewData"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { categoryLabels, CategoryType } from '@/types/OmikujiData/CategoryType'
  import type { ImportMode, ImportPreview } from './useImportPreviewManager'
  import ModalFooterActions from '@ConfigComponents/parts/ModalFooterActions.vue'

  interface Props {
    previewData: ImportPreview | null
    enabledCategories: CategoryType[]
  }

  interface Emits {
    (e: 'cancel'): void
    (e: 'confirm'): void
    (e: 'category-enabled-change', category: CategoryType, enabled: boolean): void
    (e: 'category-mode-change', category: CategoryType, mode: ImportMode): void
  }

  const props = defineProps<Props>()
  const emit = defineEmits<Emits>()

  // Computed
  const hasEnabledCategories = computed(() => props.enabledCategories.length > 0)

  // カテゴリ表示名を取得
  const getCategoryDisplayName = (category: CategoryType): string => {
    return categoryLabels[category].label || category
  }

  // カテゴリ有効/無効切り替え
  const handleCategoryEnabledChange = (category: CategoryType, event: Event) => {
    const enabled = (event.target as HTMLInputElement).checked
    emit('category-enabled-change', category, enabled)
  }

  // カテゴリモード変更
  const handleCategoryModeChange = (category: CategoryType, mode: ImportMode) => {
    emit('category-mode-change', category, mode)
  }
</script>
