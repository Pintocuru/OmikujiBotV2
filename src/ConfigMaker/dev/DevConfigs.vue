<!-- src/configMaker/dev/components/DevConfigs.vue -->
<template>
  <div class="card bg-gradient-to-r from-primary to-secondary">
    <div class="card-body px-4 py-2">
      <!-- ヘッダー -->
      <DevHeader />

      <!-- 読み込みセクション -->
      <DevFileList />

      <!-- 接続ステータス -->
      <div class="text-xs flex items-center text-primary-content gap-2">
        <div class="status" :class="devStore.isServerConnected ? 'status-info' : 'status-error'" />
        <span>{{
          !devStore.isServerConnected
            ? 'サーバー未接続'
            : isExpressMode
              ? '開発サーバー接続中…'
              : 'プラグインサーバー接続中…'
        }}</span>
        <span v-if="!isDev && !isPro"> PRO 版では全件表示できます（通常/Adv 版は最新 3 件まで）</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { onMounted } from 'vue'
  import { storeToRefs } from 'pinia'
  import { isDev } from '@/types'
  import DevHeader from './components/DevHeader.vue'
  import DevFileList from './components/DevFileList.vue'
  import { useDevStore } from '@config/dev/stores/useDevStore'
  import { useSettingMode } from '../scripts/useAccessCheckerConfig'

  const devStore = useDevStore()
  const { isExpressMode } = storeToRefs(devStore)
  const { isPro } = useSettingMode()

  onMounted(() => {
    devStore.fetchFileList()
  })
</script>
