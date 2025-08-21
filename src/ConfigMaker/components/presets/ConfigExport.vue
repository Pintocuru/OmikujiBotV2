<!-- src/configMaker/components/presets/ConfigExport.vue -->
<template>
  <div class="flex flex-wrap gap-2">
    <div v-if="isDev && saveFileName">
      <button
        @click="() => devStore.overwriteConfig(saveFileName)"
        class="btn btn-warning tooltip tooltip-top"
        :class="!hasChanged ? 'btn-soft' : ''"
        data-tip="ファイルを保存"
        :disabled="!hasChanged || !saveFileName"
      >
        <Save class="w-4 h-4" />
        {{ saveFileName.replace('.json', '') || 'ないよ' }} の保存
      </button>
    </div>
    <div class="indicator">
      <span v-if="hasChanged" class="indicator-item badge badge-secondary badge-sm"> 変更あり </span>
      <button
        @click="() => handleExport('config')"
        class="btn btn-primary tooltip tooltip-top"
        :class="!hasChanged ? 'btn-soft' : ''"
        data-tip="設定ファイルを出力します。保存する場合は必ずこのボタンを押してください。"
        :disabled="isExporting"
      >
        <span v-if="isExporting" class="loading loading-spinner loading-sm mr-2"></span>
        設定を出力(js)
      </button>
    </div>

    <div v-if="isPro">
      <button
        @click="() => handleExport('template')"
        class="btn btn-success tooltip tooltip-top"
        data-tip="テンプレート(JSONファイル)を出力します"
        :disabled="isExporting"
      >
        <span v-if="isExporting" class="loading loading-spinner loading-sm mr-2"></span>
        テンプレート出力(json)
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { isDev } from '@/types'
  import { useDevStore } from '@/ConfigMaker/dev/stores/useDevStore'
  import { useConfigExport } from './useConfigExport'
  import { useOmikujiStore } from '@/ConfigMaker/stores/useOmikujiStore'
  import { storeToRefs } from 'pinia'
  import { Save } from 'lucide-vue-next'
  import { useSettingMode } from '@/types/SettingMode'

  const { isExporting, exportFile } = useConfigExport()
  const omikujiStore = useOmikujiStore()
  const devStore = useDevStore()
  const { hasChanged } = storeToRefs(omikujiStore)
  const { saveFileName } = storeToRefs(devStore)
  const { isPro } = useSettingMode()

  const handleExport = async (type: 'config' | 'template') => {
    await exportFile(type)
  }
</script>
