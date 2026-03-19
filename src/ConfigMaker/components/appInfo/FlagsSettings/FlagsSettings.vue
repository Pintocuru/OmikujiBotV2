<!-- src/ConfigMaker/components/appInfo/FlagsSettings/FlagsSettings.vue -->
<template>
  <div class="space-y-4">
    <!-- プリセットボタン -->
    <div v-if="isDev || isGod" class="flex gap-2">
      <button @click="setFullVisibility" class="btn btn-sm btn-primary">Full</button>
      <button @click="setSoloVisibility" class="btn btn-sm btn-secondary">Solo</button>
    </div>

    <!-- 基本アイテムの可視性 -->
    <FlagsUsage />

    <!-- ゲームスクリプト設定 -->
    <FlagsGames />

    <!-- Dev用設定 -->
    <FlagsDeveloper />
  </div>
</template>

<script setup lang="ts">
  import { FlagsType, isDev } from '@/types/'
  import FlagsUsage from './FlagsUsageSettings.vue'
  import FlagsGames from './FlagsGamesSettings.vue'
  import FlagsDeveloper from './FlagsDeveloperSettings.vue'
  import { useSettingMode } from '@config/scripts/useAccessCheckerConfig'
  import { useOmikujiStore } from '@config/stores/useOmikujiStore'

  const { updateFlags } = useOmikujiStore()
  const { isGod } = useSettingMode()

  /**
   * 「full」プリセット
   */
  const setFullVisibility = () => {
    const fullSettings: FlagsType = {
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
        itemSlotEnabled: 'basic' as const,
      },
    }

    updateFlags(fullSettings)
  }

  /**
   * 「solo」プリセット
   */
  const setSoloVisibility = () => {
    const soloSettings: FlagsType = {
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
        itemSlotEnabled: 'basic' as const,
      },
    }

    updateFlags(soloSettings)
  }
</script>
