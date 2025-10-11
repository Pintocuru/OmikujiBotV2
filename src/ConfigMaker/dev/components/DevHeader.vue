<!-- C:\_root\_nodejs\OmikenTemplates\templates\OmikujiBot\src\ConfigMaker\dev\DevHeader.vue -->
<template>
  <div class="flex items-center justify-between">
    <div class="flex items-center gap-2">
      <div class="badge badge-warning">DEV</div>
      <h2 class="text-lg font-bold text-primary-content">開発者用プリセット管理</h2>
    </div>

    <div class="flex items-center gap-2">
      <button
        @click="devStore.overwriteOmikujiData"
        :disabled="devStore.isSaving"
        class="btn btn-success btn-sm tooltip tooltip-top"
        data-tip="assets/omikujiData.js を上書き保存"
      >
        <span v-if="devStore.isSaving" class="loading loading-spinner loading-xs mr-2"></span>
        <Save class="w-4 h-4 mr-2" />
        omikujiData.js に保存
      </button>

      <button
        @click="devStore.saveConfigAutoName"
        :disabled="devStore.isSaving"
        class="btn btn-success btn-sm tooltip tooltip-bottom"
        data-tip="現在の設定を日付ファイル名で保存"
      >
        <span v-if="devStore.isSaving" class="loading loading-spinner loading-xs mr-2"></span>
        <Save class="w-4 h-4 mr-2" />
        新規保存
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { useDevStore } from '@/ConfigMaker/dev/stores/useDevStore'
  import { Save } from 'lucide-vue-next'

  const devStore = useDevStore()
</script>
