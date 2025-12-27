<!-- src\ConfigMaker\components\presetsImport\ConfigImportModal.vue -->
<template>
  <div class="modal modal-open">
    <div class="modal-box max-w-3xl">
      <SectionCard
        icon="Merge"
        :is-open="true"
        variant="success"
        title="設定読み込みプレビュー"
        :description="`総項目数: ${importManager.previewData.value ? importManager.previewData.value.totalItems : ''}`"
      >
        <div v-if="importManager.previewData.value" class="space-y-4">
          <!-- Record型カテゴリ別設定 -->
          <div class="space-y-2">
            <h3 class="font-semibold text-lg">データカテゴリ</h3>
            <CategoryConfigSection
              v-for="(config, category) in importManager.previewData.value.recordCategories"
              :key="category"
              :category="category"
              :config="config"
              :import-manager="importManager"
            />
          </div>

          <!-- コンポーネント設定 -->
          <div v-if="Object.keys(importManager.previewData.value.componentConfigs).length > 0" class="space-y-2">
            <h3 class="font-semibold text-lg">コンポーネント設定</h3>
            <ComponentConfigSection
              v-for="(config, component) in importManager.previewData.value.componentConfigs"
              :key="component"
              :component="component"
              :config="config"
              :import-manager="importManager"
            />
          </div>

          <ModalFooterActions
            class="pt-4"
            :on-cancel="importManager.closePreviewModal"
            :on-save="handleImportConfirm"
            saveName="読み込む"
            :disabled="!importManager.enabledCategories.value.length || !importManager.previewData.value"
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
  import { useImportManager } from './composables/useImportManager'
  import CategoryConfigSection from './CategoryConfigSection.vue'
  import ComponentConfigSection from './ComponentConfigSection.vue'
  import ModalFooterActions from '@ConfigComponents/parts/ModalFooterActions.vue'
  import SectionCard from '@shared/components/parts/SectionCard.vue'

  const props = defineProps<{
    importManager: ReturnType<typeof useImportManager>
  }>()

  const importManager = props.importManager

  const handleImportConfirm = () => {
    try {
      importManager.executeImport()
    } catch (error) {
      console.error('Import error:', error)
    }
  }
</script>
