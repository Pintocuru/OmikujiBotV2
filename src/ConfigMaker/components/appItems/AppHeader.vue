<!-- src/configMaker/components/appItems/AppHeader.vue -->
<template>
  <h1
    class="flex justify-center text-2xl font-bold mb-6 text-center"
    :class="isGod ? ['text-warning'] : isPro ? ['text-success'] : ['text-primary']"
  >
    <div class="flex items-center gap-2">
      おみくじBot コンフィグエディター
      <!-- Licenseバッジ -->
      <LicenseBadge godTip="私が神です!" proTip="テンプレートが扱える、有料版です!" />
    </div>
  </h1>
</template>

<script setup lang="ts">
  import LicenseBadge from '@ConfigComponents/parts/LicenseBadge.vue'
  import { useSettingMode } from '@/ConfigMaker/scripts/useSettingMode'
  const { isPro, isGod } = useSettingMode()
</script>
