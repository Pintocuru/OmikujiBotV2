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
    <div class="absolute top-0 right-0 text-xs opacity-70">現在のバージョン : {{ data.meta.generatorVersion }}</div>
  </h1>
  {{ data.meta.generatorName }}
</template>

<script setup lang="ts">
  import LicenseBadge from '@ConfigComponents/parts/LicenseBadge.vue'
  import { useSettingMode } from '@/ConfigMaker/scripts/useSettingMode'
  import { useOmikujiStore } from '@/ConfigMaker/stores/useOmikujiStore'
  import { storeToRefs } from 'pinia'

  const { isPro, isGod } = useSettingMode()

  // Pinia store
  const omikujiStore = useOmikujiStore()
  const { data } = storeToRefs(omikujiStore)
</script>
