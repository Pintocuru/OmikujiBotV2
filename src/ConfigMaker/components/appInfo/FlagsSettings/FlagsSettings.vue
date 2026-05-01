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
  import { FlagsType, FlagsUsageSchema, isDev } from '@/types'
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
      usage: FlagsUsageSchema.parse({
        comments: 'basic',
        timers: 'basic',
        metas: 'basic',
        reactions: 'basic',
        actionSets: 'basic',
        placeholders: 'basic',
        characters: 'basic',
      }),
      components: [],
      gameScripts: [],

      developer: {
        jsonMergeSettings: 'basic',
        licenseVisible: 'basic',
        itemSlotEnabled: 'basic',
      },
    }

    updateFlags(fullSettings)
  }

  /**
   * 「solo」プリセット
   */
  const setSoloVisibility = () => {
    const soloSettings: FlagsType = {
      usage: FlagsUsageSchema.parse({
        comments: 'basic',
        timers: 'none',
        metas: 'none',
        reactions: 'none',
        actionSets: 'basic',
        placeholders: 'basic',
        characters: 'none',
      }),
      components: [],
      gameScripts: [],

      developer: {
        licenseVisible: 'basic',
        jsonMergeSettings: 'none',
        itemSlotEnabled: 'basic',
      },
    }

    updateFlags(soloSettings)
  }
</script>
