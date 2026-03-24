<!-- src/ConfigMaker/components/presetsImport/ConfigImport.vue -->
<template>
  <div class="flex-1">
    <input ref="fileInputRef" type="file" accept=".json" @change="handleFileSelection" class="hidden" />
    <button
      v-if="isPro"
      @click="fileInputRef?.click()"
      class="btn btn-success tooltip tooltip-top truncate"
      data-tip="ダウンロード、またはテンプレート出力したjsonファイルを読み込みます"
      :disabled="importManager.isLoading.value"
    >
      <span v-if="importManager.isLoading.value" class="loading loading-spinner loading-sm mr-2"></span>
      テンプレート読み込み(json)
    </button>

    <!-- モーダル表示 -->
    <ConfigImportModal v-if="importManager.showPreviewModal.value" :import-manager="importManager" />
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import { useImportManager } from './composables/useImportManager'
  import { useSettingMode } from '@config/scripts/useAccessCheckerConfig'
  import ConfigImportModal from '@config/components/presetsImport/ConfigImportModal.vue'
  import { swalModal } from '@/common/SweetAlert2/SweetAlert2Toast'

  const { isPro } = useSettingMode()
  const importManager = useImportManager()
  const fileInputRef = ref<HTMLInputElement | null>(null)

  const handleFileSelection = async (event: Event) => {
    const file = (event.target as HTMLInputElement).files?.[0]
    if (!file) return

    const result = await importManager.loadFromFile(file)

    if (!result.success) {
      if (result.error === 'invalid-metadata') {
        await swalModal.error({
          title: '無効なファイル',
          text: 'このファイルはおみくじBOTのデータではありません。正しいJSONファイルを選択してください。',
        })
      } else {
        await swalModal.error({
          title: '読み込みエラー',
          text: result.error || '不明なエラーが発生しました',
        })
      }
      ;(event.target as HTMLInputElement).value = ''
      return
    }

    importManager.generatePreview()
    importManager.openPreviewModal()
    ;(event.target as HTMLInputElement).value = ''
  }
</script>
