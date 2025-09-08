<!-- src/configMaker/components/appItems/AppHeader.vue -->
<template>
  <h1
    class="flex justify-center text-2xl font-bold mb-6 text-center relative"
    :class="isGod ? ['text-warning'] : isPro ? ['text-success'] : ['text-primary']"
  >
    <div class="flex items-center gap-2">
      おみくじBot コンフィグエディター
      <LicenseBadge godTip="私が神です!" proTip="テンプレートが扱える、有料版です!" />
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
  import LicenseBadge from '@ConfigComponents/parts/LicenseBadge.vue'
  import { useSettingMode } from '@/ConfigMaker/scripts/useSettingMode'
  import { useOmikujiStore } from '@/ConfigMaker/stores/useOmikujiStore'
  import { storeToRefs } from 'pinia'
  import { onMounted } from 'vue'
  import { toast } from 'vue-sonner'

  const { isPro, isGod } = useSettingMode()

  // Pinia store
  const omikujiStore = useOmikujiStore()
  const { data, versionInfo } = storeToRefs(omikujiStore)
  const { checkVersion } = omikujiStore

  // 更新通知ダイアログ表示 (vue-sonner)
  const showUpdateDialog = () => {
    if (versionInfo.value.hasNewVersion) {
      toast.info(
        `新しいバージョンが利用可能です！\n現在: ${versionInfo.value.current}\n最新: ${versionInfo.value.latest}`,
        {
          duration: 15000,
          action: {
            label: 'GitHubを開く',
            onClick: () => window.open('https://github.com/Pintocuru/OmikujiBot-Docs/releases/latest', '_blank'),
          },
        }
      )
    }
  }

  // マウント時にバージョンチェック実行
  onMounted(() => checkVersion())
</script>
