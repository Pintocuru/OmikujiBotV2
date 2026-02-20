<!-- src/ConfigMaker/components/presetsImport/CategoryModeSelector.vue -->
<template>
  <div class="flex items-center gap-4">
    <span class="text-sm">読み込み方法:</span>
    <div class="flex gap-2">
      <label class="flex items-center gap-1">
        <input
          type="radio"
          :name="`mode-${category}`"
          value="partial-merge"
          :checked="config.mode === 'partial-merge'"
          @change="() => handleModeChange('partial-merge')"
          class="radio radio-sm"
        />
        <span class="text-sm">マージ</span>
      </label>
      <label class="flex items-center gap-1">
        <input
          type="radio"
          :name="`mode-${category}`"
          value="partial-replace"
          :checked="config.mode === 'partial-replace'"
          @change="() => handleModeChange('partial-replace')"
          class="radio radio-sm"
        />
        <span class="text-sm">置き換え</span>
      </label>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { RecordCategoryType } from '@/types/OmikujiData/'
  import { useImportManager } from './composables/useImportManager'
  import { ImportMode } from './ImportTypes'

  const props = defineProps<{
    category: RecordCategoryType
    config: {
      mode: ImportMode
    }
    importManager: ReturnType<typeof useImportManager>
  }>()

  const handleModeChange = (mode: ImportMode) => {
    props.importManager.updateCategoryConfig(props.category, { mode })
  }
</script>
