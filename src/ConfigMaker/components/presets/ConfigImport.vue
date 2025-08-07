<!-- src/configMaker/components/presets/ConfigImport.vue -->
<template>
 <div class="flex-1 min-w-80">
  <span class="font-medium mr-2">設定読み込み:</span>
  <input
   ref="fileInputRef"
   type="file"
   accept=".json"
   @change="handleFileSelection"
   class="hidden"
  />
  <button
   @click="openFileDialog"
   class="btn btn-secondary tooltip tooltip-top"
   data-tip="ダウンロード、またはテンプレート出力したjsonファイルを読み込みます"
   :disabled="isLoading"
  >
   <span v-if="isLoading" class="loading loading-spinner loading-sm mr-2"></span>
   テンプレート読み込み(JSON)
  </button>
 </div>

 <!-- インポートプレビューモーダル -->
 <ConfigImportModal
  v-if="showPreviewModal"
  :previewData="previewData"
  :enabledCategories="jsonImporter.enabledCategories.value"
  @cancel="cancelImportProcess"
  @confirm="executeImportProcess"
  @category-enabled-change="handleCategoryEnabledChange"
  @category-mode-change="handleCategoryModeChange"
 />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { toast } from 'vue-sonner';
import { type CategoryType } from '@/types/';
import ConfigImportModal from './ConfigImportModal.vue';
import type { ImportMode } from './useImportPreviewManager';
import { useJsonImporter } from './useJsonImporter';
import { useOmikujiStore } from '@ConfigStores/useOmikujiStore';

// Store
const omikujiStore = useOmikujiStore();

// Composables
const jsonImporter = useJsonImporter();
// Expose refs and methods for template
const { fileInputRef, isLoading, previewData, openFileDialog } = jsonImporter;

// State
const showPreviewModal = ref(false);

// ファイル選択処理
const handleFileSelection = async (event: Event) => {
 const data = await jsonImporter.handleFileSelection(event);

 if (jsonImporter.loadError.value) {
  toast.error(jsonImporter.loadError.value);
  return;
 }

 if (data) {
  // プレビュー生成
  const preview = jsonImporter.createImportPreview(omikujiStore.data);
  if (preview) {
   showPreviewModal.value = true;
  }
 }
};

// カテゴリ有効/無効切り替え - 引数を修正
const handleCategoryEnabledChange = (category: CategoryType, enabled: boolean) => {
 jsonImporter.updateImportCategoryConfig(category, { enabled });
};

// カテゴリモード変更
const handleCategoryModeChange = (category: CategoryType, mode: ImportMode) => {
 jsonImporter.updateImportCategoryConfig(category, { mode });
};

// インポート実行
const executeImportProcess = () => {
 try {
  // ストアのデータを更新
  const result = jsonImporter.executeDataImport();
  if (result) {
   showPreviewModal.value = false;
   jsonImporter.resetImportProcess();
  }
 } catch (error) {
  console.error('Import error:', error);
  toast.error('設定の読み込みに失敗しました。');
 }
};

// インポートキャンセル
const cancelImportProcess = () => {
 showPreviewModal.value = false;
 jsonImporter.resetImportProcess();
};
</script>
