<!-- src/ConfigMaker/components/appItems/navigation/NavigationSidebarFooter.vue -->
<template>
  <div class="sticky bottom-2 left-0 w-full flex flex-col items-center space-y-2">
    <!-- 開発者モード -->
    <template v-if="isDev">
      <template v-if="saveFileName">
        <button
          class="btn btn-xs btn-warning truncate"
          :class="!hasChanged ? 'btn-soft' : ''"
          data-tip="ファイルを保存"
          :disabled="!hasChanged || !saveFileName"
          @click="devStore.overwriteConfig(saveFileName)"
        >
          <Save class="w-4 h-4" />
          {{ saveFileName.replace('.json', '') }} の保存
        </button>
      </template>

      <!-- ライセンススイッチ -->
      <LicenseSwitch />
    </template>

    <!-- 通常モード -->
    <template v-else>
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
    </template>

    <!-- ライセンスバッジ -->
    <LicenseBadge />
  </div>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia'
  import { isDev } from '@/types'
  import { useOmikujiStore } from '@config/stores/useOmikujiStore'
  import { useDevStore } from '@/PresetManager/stores/useDevStore'
  import { useConfigExport } from '../../presetsExport/useConfigExport'

  import LicenseSwitch from '@config/components/appInfo/settings/LicenseSwitch.vue'
  import LicenseBadge from '@config/components/parts/LicenseBadge.vue'
  import { Save } from 'lucide-vue-next'

  // store
  const omikujiStore = useOmikujiStore()
  const { hasChanged } = storeToRefs(omikujiStore)

  const devStore = useDevStore()
  const { saveFileName } = storeToRefs(devStore)

  const { isExporting, exportFile } = useConfigExport()
</script>
