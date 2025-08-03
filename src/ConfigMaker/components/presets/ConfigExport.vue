<!-- src/configMaker/components/presets/ConfigExport.vue -->
<template>
 <div class="flex flex-wrap gap-2">
  <button
   @click="() => handleExport('config')"
   class="btn btn-primary tooltip tooltip-top"
   data-tip="設定ファイルを出力します。保存する場合は必ずこのボタンを押してください。"
   :disabled="isExporting"
  >
   <span v-if="isExporting" class="loading loading-spinner loading-sm mr-2"></span>
   設定を出力(js)
  </button>

  <button
   @click="() => handleExport('template')"
   class="btn btn-secondary tooltip tooltip-top"
   data-tip="テンプレート(JSONファイル)を出力します"
   :disabled="isExporting"
  >
   <span v-if="isExporting" class="loading loading-spinner loading-sm mr-2"></span>
   テンプレート出力(json)
  </button>
 </div>
</template>

<script setup lang="ts">
import { useConfigExport } from './useConfigExport';

const { isExporting, exportFile } = useConfigExport();

const handleExport = async (type: 'config' | 'template') => {
 await exportFile(type);
};
</script>
