<!-- src/configMaker/dev/components/DevConfigs.vue -->
<template>
  <div class="card bg-gradient-to-r from-primary to-secondary mb-4">
    <div class="card-body p-4">
      <!-- ヘッダー -->
      <DevHeader />

      <!-- 読み込みセクション -->
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
  import DevHeader from './components/DevHeader.vue'
  import DevFileList from './components/DevFileList.vue'
  import { useDevStore } from '@config/dev/stores/useDevStore'

  const devStore = useDevStore()

  onMounted(() => {
    devStore.fetchFileList()
  })
</script>
