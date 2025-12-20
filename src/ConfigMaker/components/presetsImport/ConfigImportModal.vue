<!-- src\ConfigMaker\components\presetsImport\ConfigImportModal.vue -->
<template>
  <div class="modal modal-open">
    <div class="modal-box max-w-3xl">
      <SectionCard
        :is-open="true"
        variant="success"
        title="設定読み込みプレビュー"
        :description="`総項目数: ${importStore.previewData ? importStore.previewData.totalItems : ''}`"
      >
        <div v-if="importStore.previewData" class="space-y-4">
          <!-- 読み込みモード選択 -->
          <ImportModeSelector />

          <!-- Record型カテゴリ別設定 -->
          <template v-if="importStore.previewData.importMode !== 'full'">
            <CategoryConfigSection
              v-for="(config, category) in importStore.previewData.recordCategories"
              :key="category"
              :category="category"
              :config="config"
            />
          </template>

          <ModalFooterActions
            class="pt-4"
            :on-cancel="importStore.closePreviewModal"
            :on-save="handleImportConfirm"
            saveName="読み込む"
            :disabled="!importStore.enabledCategories.length || !importStore.previewData"
          />
        </div>

        <div v-else class="text-center py-8">
          <div class="text-gray-500">プレビューデータを読み込み中...</div>
        </div>
      </SectionCard>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { useImportStore } from './useImportStore'
  import ImportModeSelector from './ImportModeSelector.vue'
  import CategoryConfigSection from './CategoryConfigSection.vue'
  import ModalFooterActions from '@ConfigComponents/parts/ModalFooterActions.vue'
  import SectionCard from '@shared/components/parts/SectionCard.vue'

  // store
  const importStore = useImportStore()

  const handleImportConfirm = () => {
    try {
      importStore.executeImport()
    } catch (error) {
      console.error('Import error:', error)
    }
  }
</script>
