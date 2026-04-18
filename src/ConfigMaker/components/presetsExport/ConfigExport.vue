<!-- src/ConfigMaker/components/presetsExport/ConfigExport.vue -->
<template>
  <div class="flex gap-2">
    <!-- ローカルのデータを読む -->
    <template v-if="!hasChanged">
      <button class="btn btn-primary" @click="handleOpenLocalOmikujiData">omikujiData.js を開く</button>
    </template>

    <!-- Dev jsonファイルの保存(Server利用) -->
    <template v-if="saveFileName">
      <button
        @click="() => devStore.overwriteConfig(saveFileName)"
        class="btn btn-warning tooltip tooltip-top truncate"
        :class="!hasChanged ? 'btn-soft' : ''"
        data-tip="ファイルを保存"
        :disabled="!hasChanged || !saveFileName"
      >
        <Save class="w-4 h-4" />
        {{ saveFileName.replace('.json', '') }} の保存
      </button>
    </template>

    <!-- 設定を出力(js)-->
    <div class="indicator">
      <span v-if="hasChanged" class="indicator-item badge badge-secondary badge-sm"> 変更あり </span>
      <button
        @click="exportFile('config')"
        class="btn btn-primary tooltip tooltip-top truncate"
        :class="!hasChanged ? 'btn-soft' : ''"
        data-tip="設定ファイルを出力します。保存する場合は必ずこのボタンを押してください。"
        :disabled="isExporting"
      >
        <span v-if="isExporting" class="loading loading-spinner loading-sm mr-2"></span>
        設定を出力(js)
      </button>
    </div>

    <!-- Pro テンプレートを出力(json) -->
    <template v-if="isPro">
      <button
        @click="exportFile('template')"
        class="btn btn-success tooltip tooltip-top truncate"
        data-tip="テンプレート(JSONファイル)を出力します"
        :disabled="isExporting"
      >
        <span v-if="isExporting" class="loading loading-spinner loading-sm mr-2"></span>
        テンプレート出力(json)
      </button>
    </template>
  </div>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia'
  import { useConfigExport } from './useConfigExport'
  import { useDevStore } from '@/PresetManager/stores/useDevStore'
  import { useOmikujiStore } from '@config/stores/useOmikujiStore'
  import { useSettingMode } from '@config/scripts/useAccessCheckerConfig'
  import { useNavigationStore } from '@config/stores/useNavigationStore'
  import { Save } from 'lucide-vue-next'
  import { swalToast } from '@/common/SweetAlert2/SweetAlert2Toast'

  // Pinia store
  const omikujiStore = useOmikujiStore()
  const { data } = storeToRefs(omikujiStore)
  const navigationStore = useNavigationStore()
  const devStore = useDevStore()
  const { hasChanged } = storeToRefs(omikujiStore)
  const { saveFileName } = storeToRefs(devStore)

  // コンポーザブル
  const { isPro } = useSettingMode()
  const { isExporting, exportFile } = useConfigExport()

  const handleOpenLocalOmikujiData = () => {
    omikujiStore.openLocalOmikujiData()
    navigationStore.selectCategory(data.value.settings.initialCategory)
    swalToast.success({ title: '読み込み完了', text: 'omikujiData.js を読み込みました。' })
  }
</script>
