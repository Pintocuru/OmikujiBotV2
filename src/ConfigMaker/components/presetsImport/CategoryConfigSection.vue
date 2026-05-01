<!-- src/ConfigMaker/components/presetsImport/CategoryConfigSection.vue -->
<template>
  <div
    class="bg-base-200 rounded-lg p-3"
    :class="{
      'opacity-50': !config.enabled,
    }"
  >
    <div class="flex items-center justify-between mb-2">
      <div class="flex items-center gap-2">
        <input type="checkbox" :checked="config.enabled" @change="handleEnabledChange" class="checkbox checkbox-sm" />
        <span class="font-medium">{{ getCategoryDisplayName(category) }}</span>
        <span class="badge badge-sm badge-secondary">{{ config.count }}項目</span>
      </div>
    </div>

    <div v-if="config.enabled" class="ml-6 space-y-2">
      <!-- 読み込みモード選択 -->
      <CategoryModeSelector :category="category" :config="config" :import-manager="importManager" />

      <!-- 競合項目の表示 -->
      <ConflictsList v-if="config.conflicts.length > 0" :conflicts="config.conflicts" />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { CategoryType, RecordCategoryType, categoryMap } from '@/types'
  import { useImportManager } from './composables/useImportManager'
  import CategoryModeSelector from './CategoryModeSelector.vue'
  import ConflictsList from './ConflictsList.vue'
  import { CategoryImportConfig } from './ImportTypes'

  const props = defineProps<{
    category: RecordCategoryType
    config: CategoryImportConfig
    importManager: ReturnType<typeof useImportManager>
  }>()

  const getCategoryDisplayName = (category: CategoryType): string => {
    return categoryMap[category].label || category
  }

  const handleEnabledChange = (event: Event) => {
    const enabled = (event.target as HTMLInputElement).checked
    props.importManager.updateCategoryConfig(props.category, { enabled })
  }
</script>
