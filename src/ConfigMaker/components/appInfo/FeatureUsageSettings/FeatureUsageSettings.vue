<!-- src/ConfigMaker/components/appInfo/FeatureUsageSettings/FeatureUsageSettings.vue -->
<template>
  <div class="space-y-4">
    <!-- プリセットボタン -->
    <div v-if="isDev || isGod" class="flex gap-2">
      <button @click="setFullVisibility" class="btn btn-sm btn-primary">Full</button>
      <button @click="setSoloVisibility" class="btn btn-sm btn-secondary">Solo</button>
    </div>

    <!-- 基本アイテムの可視性 -->
    <FeatureUsageUsage />

    <!-- アイテム・ゲームスクリプト設定 -->
    <FeatureUsageComponents />
    <FeatureUsageGames />

    <!-- Dev用設定 -->
    <FeatureUsageDeveloper />
  </div>
</template>

<script setup lang="ts">
  import FeatureUsageUsage from './UsageUsageSettings.vue'
  import FeatureUsageComponents from './UsageComponentsSettings.vue'
  import FeatureUsageGames from './UsageGamesSettings.vue'
  import FeatureUsageDeveloper from './UsageDeveloperSettings.vue'
  import { useSettingMode } from '@config/scripts/useAccessCheckerConfig'
  import { useOmikujiStore } from '@config/stores/useOmikujiStore'
  import { FeatureUsageType, isDev } from '@/types/'

  const { updateFeatureUsage } = useOmikujiStore()
  const { isGod } = useSettingMode()

  /**
   * 「full」プリセット
   */
  const setFullVisibility = () => {
    const fullSettings: FeatureUsageType = {
      usage: {
        comments: 'basic' as const,
        timers: 'basic' as const,
        metas: 'basic' as const,
        actionSets: 'basic' as const,
        placeholders: 'basic' as const,
        characters: 'basic' as const,
      },
      components: ['bubble', 'toast'],
      gameScripts: [],

      developer: {
        jsonMergeSettings: 'basic' as const,
        licenseVisible: 'basic' as const,
      },
    }

    updateFeatureUsage(fullSettings)
  }

  /**
   * 「solo」プリセット
   */
  const setSoloVisibility = () => {
    const soloSettings: FeatureUsageType = {
      usage: {
        comments: 'basic' as const,
        timers: 'none' as const,
        metas: 'none' as const,
        actionSets: 'basic' as const,
        placeholders: 'basic' as const,
        characters: 'none' as const,
      },
      components: ['toast', 'ranking'],
      gameScripts: [],

      developer: {
        licenseVisible: 'basic' as const,
        jsonMergeSettings: 'none' as const,
      },
    }

    updateFeatureUsage(soloSettings)
  }
</script>
