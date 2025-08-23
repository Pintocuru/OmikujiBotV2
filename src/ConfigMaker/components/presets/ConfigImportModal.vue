<!-- src/configMaker/components/presets/ConfigImportModal.vue (更新版) -->
<template>
  <!-- インポートプレビューモーダル -->
  <div class="modal modal-open">
    <div class="modal-box max-w-3xl">
      <h3 class="font-bold text-lg text-primary mb-4">設定読み込みプレビュー</h3>

      <div v-if="previewData" class="space-y-4">
        <!-- 読み込みモード選択 -->
        <div class="bg-base-200 p-4 rounded-lg">
          <div class="flex items-center gap-2 mb-3">
            <span class="font-medium">🔧 読み込みモード</span>
          </div>
          <div class="flex flex-col gap-3">
            <label class="flex items-start gap-3 cursor-pointer">
              <input
                type="radio"
                name="import-mode"
                value="full"
                :checked="previewData.importMode === 'full'"
                @change="handleGlobalModeChange('full')"
                class="radio radio-sm mt-1"
              />
              <div>
                <div class="font-medium">データ上書き</div>
                <div class="text-sm text-gray-600">既存のデータをすべて消し、JSONデータを適用する</div>
              </div>
            </label>
            <label class="flex items-start gap-3 cursor-pointer">
              <input
                type="radio"
                name="import-mode"
                value="partial"
                :checked="previewData.importMode === 'partial'"
                @change="handleGlobalModeChange('partial')"
                class="radio radio-sm mt-1"
              />
              <div>
                <div class="font-medium">部分的な更新</div>
                <div class="text-sm text-gray-600">
                  comments・timers・placeholders・characters のみ更新
                  <span class="text-warning"
                    >（meta・scriptSettings・displaySettings・wordPartySettings は変更されません）</span
                  >
                </div>
              </div>
            </label>
          </div>
        </div>

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

        <!-- Object型カテゴリの情報表示（部分更新時のみ） -->
        <div
          v-if="previewData.importMode === 'partial' && previewData.hasValidObjectCategories"
          class="bg-yellow-50 border border-yellow-200 p-3 rounded-lg"
        >
          <div class="flex items-center gap-2 mb-2">
            <span class="text-yellow-600">ℹ️</span>
            <span class="font-medium text-yellow-800">Object型カテゴリについて</span>
          </div>
          <div class="text-sm text-yellow-700">
            meta・scriptSettings・displaySettings・wordPartySettings は部分更新では変更されません。
            これらを更新したい場合は「データ上書き」モードを選択してください。
          </div>
        </div>

        <!-- Record型カテゴリ別設定 -->
        <div class="space-y-3">
          <h4 class="font-medium">Record型カテゴリ読み込み設定</h4>

          <div
            v-for="(config, category) in previewData.recordCategories"
            :key="category"
            class="border border-base-300 rounded-lg p-3"
            :class="{
              'opacity-50': !config.enabled && previewData.importMode === 'partial',
            }"
          >
            <div class="flex items-center justify-between mb-2">
              <div class="flex items-center gap-2">
                <input
                  type="checkbox"
                  :checked="config.enabled"
                  :disabled="previewData.importMode === 'partial' && !partialUpdateTargets.includes(category)"
                  @change="handleCategoryEnabledChange(category, $event)"
                  class="checkbox checkbox-sm"
                />
                <span class="font-medium">{{ getCategoryDisplayName(category) }}</span>
                <span class="badge badge-sm">{{ config.count }}項目</span>
                <span
                  v-if="previewData.importMode === 'partial' && !partialUpdateTargets.includes(category)"
                  class="badge badge-warning badge-xs"
                >
                  部分更新対象外
                </span>
              </div>
            </div>

            <div v-if="config.enabled" class="ml-6 space-y-2">
              <!-- 読み込みモード選択 -->
              <div class="flex items-center gap-4">
                <span class="text-sm">読み込み方法:</span>
                <div class="flex gap-2">
                  <!-- 全体モードの場合 -->
                  <template v-if="previewData.importMode === 'full'">
                    <label class="flex items-center gap-1">
                      <input
                        type="radio"
                        :name="`mode-${category}`"
                        value="full-replace"
                        :checked="config.mode === 'full-replace'"
                        @change="handleCategoryModeChange(category, 'full-replace')"
                        class="radio radio-sm"
                      />
                      <span class="text-sm">上書き</span>
                    </label>
                  </template>

                  <!-- 部分モードの場合 -->
                  <template v-else>
                    <label class="flex items-center gap-1">
                      <input
                        type="radio"
                        :name="`mode-${category}`"
                        value="partial-replace"
                        :checked="config.mode === 'partial-replace'"
                        @change="handleCategoryModeChange(category, 'partial-replace')"
                        class="radio radio-sm"
                      />
                      <span class="text-sm">置き換え</span>
                    </label>
                    <label class="flex items-center gap-1">
                      <input
                        type="radio"
                        :name="`mode-${category}`"
                        value="partial-merge"
                        :checked="config.mode === 'partial-merge'"
                        @change="handleCategoryModeChange(category, 'partial-merge')"
                        class="radio radio-sm"
                      />
                      <span class="text-sm">マージ</span>
                    </label>
                  </template>
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
            <template v-if="previewData.importMode === 'full'">
              <li><strong>上書き:</strong> 全データを新しい設定で完全に置き換え</li>
            </template>
            <template v-else>
              <li><strong>置き換え:</strong> 対象カテゴリを新しい設定で置き換え</li>
              <li><strong>マージ:</strong> 既存設定に新しい設定を追加・上書き</li>
              <li class="text-warning">
                <strong>注意:</strong> meta・scriptSettings・displaySettings・wordPartySettings は変更されません
              </li>
            </template>
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
        saveName="読み込む"
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

  // 部分更新の対象カテゴリ
  const partialUpdateTargets: CategoryType[] = ['comments', 'timers', 'placeholders', 'characters']

  interface Props {
    previewData: ImportPreview | null
    enabledCategories: CategoryType[]
  }

  interface Emits {
    (e: 'cancel'): void
    (e: 'confirm'): void
    (e: 'category-enabled-change', category: CategoryType, enabled: boolean): void
    (e: 'category-mode-change', category: CategoryType, mode: ImportMode): void
    (e: 'global-mode-change', mode: 'full' | 'partial'): void
  }

  const props = defineProps<Props>()
  const emit = defineEmits<Emits>()

  // Computed
  const hasEnabledCategories = computed(() => props.enabledCategories.length > 0)

  // カテゴリ表示名を取得
  const getCategoryDisplayName = (category: CategoryType): string => {
    return categoryLabels[category].label || category
  }

  // グローバルモード変更
  const handleGlobalModeChange = (mode: 'full' | 'partial') => {
    emit('global-mode-change', mode)
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
