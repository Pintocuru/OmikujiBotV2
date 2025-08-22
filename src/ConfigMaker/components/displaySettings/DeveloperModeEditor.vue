<!-- src/ConfigMaker/components/display/DeveloperModeEditor.vue -->
<template>
  <div v-if="isGod" class="space-y-4">
    <!-- 起動設定 -->
    <StartupSettings />

    <!-- コンポーネント可視性設定 -->
    <VisibilitySettings />

    <!-- 補足説明(´・ω・｀) -->
    <DeveloperModeInfo />
  </div>
</template>

<script setup lang="ts">
  import StartupSettings from './StartupSettings.vue'
  import VisibilitySettings from './VisibilitySettings.vue'
  import DeveloperModeInfo from './DeveloperModeInfo.vue'
  import { useSettingMode } from '@/ConfigMaker/scripts/useSettingMode'

  // Store

  const { isGod } = useSettingMode()
</script>
