<!-- src/ConfigMaker/components/presetsImport/ConfigImportModal.vue -->
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
            <template v-for="(config, category) in importManager.previewData.value.recordCategories" :key="category">
              <CategoryConfigSection
                v-if="config.count > 0"
                :category="category"
                :config="config"
                :import-manager="importManager"
              />
            </template>
          </div>

          <!-- アイテム設定 -->
          <div v-if="Object.keys(mergedComponentConfigs).length > 0" class="space-y-2">
            <h3 class="font-semibold text-lg">アイテム設定</h3>
            <ComponentConfigSection
              v-for="(entry, component) in mergedComponentConfigs"
              :key="component"
              :componentKey="component as UiKind"
              :config="entry.config"
              :is-import-only="entry.isImportOnly"
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
  import { computed } from 'vue'
  import { UiKind } from '@/types'
  import { ComponentImportConfig } from './ImportTypes'
  import { useImportManager } from './composables/useImportManager'
  import CategoryConfigSection from './CategoryConfigSection.vue'
  import ComponentConfigSection from './ComponentConfigSection.vue'
  import ModalFooterActions from '@config/components/parts/ModalFooterActions.vue'
  import SectionCard from '@shared/components/parts/SectionCard.vue'

  const props = defineProps<{
    importManager: ReturnType<typeof useImportManager>
  }>()

  /**
   * componentConfigs（既存 + 読み込み側のみ）をマージした表示用マップ
   * - 既存にあるキー: isImportOnly=false、ラジオで既存/読み込みを選択可能
   * - 読み込み側にのみあるキー: isImportOnly=true、enabled=true/useImported=true で初期化済み
   */
  const mergedComponentConfigs = computed(
    (): Record<string, { config: ComponentImportConfig; isImportOnly: boolean }> => {
      const preview = props.importManager.previewData.value
      const imported = props.importManager.importedData.value
      if (!preview || !imported) return {}

      const result: Record<string, { config: ComponentImportConfig; isImportOnly: boolean }> = {}

      // 既存の componentConfigs をそのまま追加
      for (const [key, config] of Object.entries(preview.componentConfigs) as [UiKind, ComponentImportConfig][]) {
        result[key] = { config, isImportOnly: false }
      }

      // インポートデータの components.settings に存在するキーのうち
      // componentConfigs に存在しないものを「読み込み側のみ」として追加
      const importedSettingsKeys = Object.keys(imported.components?.settings ?? {}) as UiKind[]
      for (const key of importedSettingsKeys) {
        if (!(key in result)) {
          const importOnlyConfig: ComponentImportConfig = { enabled: true, useImported: true }
          props.importManager.updateComponentConfig(key, importOnlyConfig)
          result[key] = { config: importOnlyConfig, isImportOnly: true }
        }
      }

      return result
    }
  )

  const handleImportConfirm = () => {
    try {
      props.importManager.executeImport()
    } catch (error) {
      console.error('Import error:', error)
    }
  }
</script>
