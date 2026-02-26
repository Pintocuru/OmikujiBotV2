<!-- src/ConfigMaker/components/presetsExport/ConfigExport.vue -->
<template>
  <div class="flex gap-2">
    <!-- ローカルのデータを読む -->
    <template v-if="!hasChanged">
      <button class="btn btn-primary" @click="omikujiStore.openLocalOmikujiData()">omikujiData.js を開く</button>
    </template>

    <!-- Dev jsonファイルの保存(Server利用) -->
    <div v-if="saveFileName">
      <button
        @click="() => devStore.overwriteConfig(saveFileName)"
        class="btn btn-warning tooltip tooltip-top"
        :class="!hasChanged ? 'btn-soft' : ''"
        data-tip="ファイルを保存"
        :disabled="!hasChanged || !saveFileName"
      >
        <Save class="w-4 h-4" />
        {{ saveFileName.replace('.json', '') }} の保存
      </button>
    </div>

    <!-- 設定を出力(js)-->
    <div class="indicator">
      <span v-if="hasChanged" class="indicator-item badge badge-secondary badge-sm"> 変更あり </span>
      <button
        @click="exportFile('config')"
        class="btn btn-primary tooltip tooltip-top"
        :class="!hasChanged ? 'btn-soft' : ''"
        data-tip="設定ファイルを出力します。保存する場合は必ずこのボタンを押してください。"
        :disabled="isExporting"
      >
        <span v-if="isExporting" class="loading loading-spinner loading-sm mr-2"></span>
        設定を出力(js)
      </button>
    </div>

    <!-- Pro テンプレートを出力(json) -->
    <div v-if="isPro">
      <button
        @click="exportFile('template')"
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
  import { useConfigExport } from './useConfigExport'
  import { useDevStore } from '@/PresetManager/stores/useDevStore'
  import { useOmikujiStore } from '@config/stores/useOmikujiStore'
  import { useSettingMode } from '@config/scripts/useAccessCheckerConfig'
  import { storeToRefs } from 'pinia'
  import { Save } from 'lucide-vue-next'

  // Pinia store
  const omikujiStore = useOmikujiStore()
  const devStore = useDevStore()
  const { hasChanged } = storeToRefs(omikujiStore)
  const { saveFileName } = storeToRefs(devStore)

  // コンポーザブル
  const { isPro } = useSettingMode()
  const { isExporting, exportFile } = useConfigExport()
</script>
