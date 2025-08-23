<!-- src\ConfigMaker\components\presetsImport\ImportModeSelector.vue -->
<template>
  <SettingItem label="読み込みモード" :show-reset="false">
    <div class="flex flex-col gap-3">
      <label class="flex items-start gap-3 cursor-pointer">
        <input
          type="radio"
          name="import-mode"
          value="full"
          :checked="importStore.previewData?.importMode === 'full'"
          @change="() => importStore.setGlobalImportMode('full')"
          class="radio radio-sm mt-1"
        />
        <div>
          <div class="font-medium">すべてのデータを上書き</div>
          <div class="text-sm">既存のデータをすべて消し、JSONデータを適用する</div>
        </div>
      </label>
      <label class="flex items-start gap-3 cursor-pointer">
        <input
          type="radio"
          name="import-mode"
          value="partial"
          :checked="importStore.previewData?.importMode === 'partial'"
          @change="() => importStore.setGlobalImportMode('partial')"
          class="radio radio-sm mt-1"
        />
        <div>
          <div class="font-medium">部分的な追加・上書き</div>
          <div class="text-sm">
            コメントルール・タイマールール・プレースホルダー・キャラクター(カラー設定) の更新
            <span class="text-warning">
              （meta・scriptSettings・displaySettings・wordPartySettings は変更されません）
            </span>
          </div>
        </div>
      </label>
    </div>
  </SettingItem>
</template>

<script setup lang="ts">
  import { useImportStore } from './useImportStore'
  import SettingItem from '@ConfigComponents/parts/SettingItem.vue'

  const importStore = useImportStore()
</script>
