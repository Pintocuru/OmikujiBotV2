<!-- src/ConfigMaker/components/appItems/AppHeader.vue -->
<template>
  <h1
    class="flex justify-center text-2xl font-bold text-center relative"
    :class="isGod ? ['text-warning'] : isPro ? ['text-success'] : isAdv ? ['text-info'] : ['text-primary']"
  >
    <div class="flex items-center gap-2">
      おみくじBOT コンフィグエディター
      <LicenseBadge
        advTip="カラー変更など、一部有料版を使えます"
        proTip="テンプレートが扱える、有料版です!"
        godTip="私が神です!"
      />
    </div>

    <!-- 左上データソース表示 -->
    <div class="absolute top-0 left-0">
      <span class="badge text-xs" :class="dataSourceClass">
        {{ dataSourceLabel }}
      </span>
    </div>

    <!-- 右上バージョン表示 -->
    <div class="absolute top-0 right-0 text-xs opacity-70 flex flex-col items-end">
      <div>現在のバージョン: {{ versionInfo.current }}</div>
      <div v-if="versionInfo.isLoading" class="text-info">チェック中...</div>
      <div v-else-if="versionInfo.error" class="text-error" :title="versionInfo.error">チェック失敗</div>
      <div v-else-if="versionInfo.hasNewVersion" class="text-warning cursor-pointer" @click="showUpdateDialog">
        新版: {{ versionInfo.latest }} 🔄
      </div>
      <div v-else-if="versionInfo.latest" class="text-success">最新版 ✓</div>
    </div>
  </h1>
</template>

<script setup lang="ts">
  import { onMounted, computed } from 'vue'
  import { storeToRefs } from 'pinia'
  import { useVersionCheck } from './useVersionCheck'
  import LicenseBadge from '@config/components/parts/LicenseBadge.vue'
  import { useSettingMode } from '@config/scripts/useAccessCheckerConfig'
  import { useOmikujiStore } from '@config/stores/useOmikujiStore'
  import { DATA_SOURCE_MAP } from '@/types'

  const { isAdv, isPro, isGod } = useSettingMode()

  // Pinia storeから現在のバージョンを取得
  const omikujiStore = useOmikujiStore()
  const { data, dataSource } = storeToRefs(omikujiStore)

  const currentVersion = computed(() => data.value.meta.generatorVersion)

  // バージョンチェック機能
  const { versionInfo, checkVersion, showUpdateDialog } = useVersionCheck(currentVersion)

  const dataSourceLabel = computed(() => {
    return DATA_SOURCE_MAP[dataSource.value].label
  })

  const dataSourceClass = computed(() => {
    return DATA_SOURCE_MAP[dataSource.value].class
  })

  // マウント時にバージョンチェック実行
  onMounted(() => checkVersion())
</script>
