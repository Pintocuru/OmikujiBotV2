<!-- src/configMaker/dev/components/DevConfigs.vue -->
<template>
  <div class="card bg-gradient-to-r from-primary to-secondary mb-4">
    <div class="card-body p-4">
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

      <!-- 読み込みセクション（フル幅） -->
      <DevFileList />

      <!-- 接続ステータス -->
      <div class="text-xs flex items-center text-primary-content gap-2 mt-4">
        <div class="status" :class="devStore.isServerConnected ? 'status-info' : 'status-error'" />
        <span>{{ devStore.isServerConnected ? '開発サーバー接続中' : '開発サーバー未接続' }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { onMounted } from 'vue'
  import DevFileList from './components/DevFileList.vue'
  import { useDevStore } from '@/ConfigMaker/dev/stores/useDevStore'
  import { Save } from 'lucide-vue-next'

  const devStore = useDevStore()

  // マウント時にファイル一覧を取得
  onMounted(() => {
    devStore.fetchFileList()
  })
</script>
