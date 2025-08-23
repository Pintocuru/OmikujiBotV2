<!-- src/configMaker/components/presets/ConfigImport.vue (更新版) -->
<template>
  <div class="flex-1">
    <input ref="fileInputRef" type="file" accept=".json" @change="handleFileSelection" class="hidden" />
    <button
      v-if="isPro"
      @click="fileInputRef?.click()"
      class="btn btn-success tooltip tooltip-top"
      data-tip="ダウンロード、またはテンプレート出力したjsonファイルを読み込みます"
      :disabled="importStore.isLoading"
    >
      <span v-if="importStore.isLoading" class="loading loading-spinner loading-sm mr-2"></span>
      テンプレート読み込み(JSON)
    </button>
  </div>

  <!-- インポートプレビューモーダル -->
  <ConfigImportModal v-if="importStore.showPreviewModal" />
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import ConfigImportModal from './ConfigImportModal.vue'
  import { useImportStore } from './useImportStore'
  import { useSettingMode } from '@/ConfigMaker/scripts/useSettingMode'
  import { toast } from 'vue-sonner'

  const { isPro } = useSettingMode()
  const importStore = useImportStore()
  const fileInputRef = ref<HTMLInputElement | null>(null)

  const handleFileSelection = async (event: Event) => {
    const file = (event.target as HTMLInputElement).files?.[0]
    if (!file) return

    const success = await importStore.loadFromFile(file)

    if (importStore.loadError) {
      toast.error(importStore.loadError)
      return
    }

    if (success) {
      importStore.generatePreview()
      importStore.openPreviewModal()
    }

    // ファイル入力をリセット
    ;(event.target as HTMLInputElement).value = ''
  }
</script>
