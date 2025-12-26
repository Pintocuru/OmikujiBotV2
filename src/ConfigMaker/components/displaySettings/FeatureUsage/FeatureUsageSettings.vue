<!-- src\ConfigMaker\components\displaySettings\FeatureUsageSettings.vue -->
<template>
  <div class="space-y-4">
    <!-- プリセットボタン -->
    <div class="flex gap-2">
      <button @click="setFullVisibility" class="btn btn-sm btn-primary">Full</button>
      <button @click="setSoloVisibility" class="btn btn-sm btn-secondary">Solo</button>
    </div>

    <!-- 基本コンポーネントの可視性 -->
    <FeatureUsageUsage />

    <!-- コンポーネント・ゲームスクリプト設定 -->
    <FeatureUsageArray />

    <!-- Dev用設定 -->
    <FeatureUsageDeveloper />
  </div>
</template>

<script setup lang="ts">
  import FeatureUsageUsage from './FeatureUsageUsage.vue'
  import FeatureUsageArray from './FeatureUsageArray.vue'
  import FeatureUsageDeveloper from './FeatureUsageDeveloper.vue'
  import { useFeatureUsageSettings } from './useFeatureUsageSettings'

  const { setFullVisibility, setSoloVisibility } = useFeatureUsageSettings()
</script>
