<!-- src/configMaker/components/presets/ConfigImportModal.vue (更新版) -->
<template>
  <!-- インポートプレビューモーダル -->
  <div class="modal modal-open">
    <div class="modal-box max-w-3xl">
      <SectionCard variant="success" :alwaysOpen="true">
        <template #header>
          <div>設定読み込みプレビュー</div>
          <div v-if="previewData" class="text-sm pr-2">総項目数: {{ previewData.totalItems }}</div>
        </template>

        <template #body>
          <div v-if="previewData" class="space-y-4">
            <!-- 読み込みモード選択 -->
            <SettingItem label="読み込みモード" description="数値が高いほど出やすくなります" :show-reset="false">
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
                    <div class="font-medium">すべてのデータを上書き</div>
                    <div class="text-sm">既存のデータをすべて消し、JSONデータを適用する</div>
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
                    <div class="font-medium">部分的な追加・上書き</div>
                    <div class="text-sm">
                      コメントルール・タイマールール・プレースホルダー・キャラクター(カラー設定) の更新
                      <span class="text-warning"
                        >（meta・scriptSettings・displaySettings・wordPartySettings は変更されません）</span
                      >
                    </div>
                  </div>
                </label>
              </div>
            </SettingItem>

            <!-- Record型カテゴリ別設定 -->
            <template v-if="previewData.importMode !== 'full'">
              <div
                v-for="(config, category) in previewData.recordCategories"
                :key="category"
                class="bg-base-200 rounded-lg p-3"
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
                    <span class="badge badge-sm badge-secondary">{{ config.count }}項目</span>
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
            </template>

            <ModalFooterActions
              class="pt-4"
              :on-cancel="() => $emit('cancel')"
              :on-save="() => $emit('confirm')"
              saveName="読み込む"
              :disabled="!hasEnabledCategories || !previewData"
            />
          </div>
          <!-- previewData が null の場合の表示 -->
          <div v-else class="text-center py-8">
            <div class="text-gray-500">プレビューデータを読み込み中...</div>
          </div>
        </template>
      </SectionCard>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { categoryLabels, CategoryType, recordCategoryLabel } from '@/types/OmikujiData/CategoryType'
  import type { ImportMode, ImportPreview } from './ImportTypes'
  import SettingItem from '@ConfigComponents/parts/SettingItem.vue'
  import SectionCard from '@ConfigComponents/parts/SectionCard.vue'
  import ModalFooterActions from '@ConfigComponents/parts/ModalFooterActions.vue'

  // 部分更新の対象カテゴリ
  const partialUpdateTargets: CategoryType[] = [...recordCategoryLabel]

  const props = defineProps<{
    previewData: ImportPreview | null
    enabledCategories: CategoryType[]
  }>()

  const emit = defineEmits([
    'cancel',
    'confirm',
    'category-enabled-change',
    'category-mode-change',
    'global-mode-change',
  ])

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
