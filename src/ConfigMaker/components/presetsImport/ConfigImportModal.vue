<!-- src\ConfigMaker\components\presetsImport\ConfigImportModal.vue -->
<template>
  <div class="modal modal-open">
    <div class="modal-box max-w-3xl">
      <SectionCard variant="success" :alwaysOpen="true">
        <template #header>
          <div>設定読み込みプレビュー</div>
          <div v-if="importStore.previewData" class="text-sm pr-2">
            総項目数: {{ importStore.previewData.totalItems }}
          </div>
        </template>

        <template #body>
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
        </template>
      </SectionCard>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { toast } from 'vue-sonner'
  import { useImportStore } from './useImportStore'
  import SectionCard from '@ConfigComponents/parts/SectionCard.vue'
  import ModalFooterActions from '@ConfigComponents/parts/ModalFooterActions.vue'
  import ImportModeSelector from './ImportModeSelector.vue'
  import CategoryConfigSection from './CategoryConfigSection.vue'

  // store
  const importStore = useImportStore()

  const handleImportConfirm = () => {
    try {
      const result = importStore.executeImport()
      if (result) {
        toast.success('設定を読み込みました')
      } else {
        toast.error('設定の読み込みに失敗しました')
      }
    } catch (error) {
      console.error('Import error:', error)
      toast.error('設定の読み込みに失敗しました')
    }
  }
</script>
