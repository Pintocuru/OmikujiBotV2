<!-- src/ConfigMaker/components/appInfo/FeatureUsageSettings/UsageGamesSettings.vue -->
<template>
  <SettingItem label="ゲームスクリプト設定" description="ゲームスクリプト関連の表示制御">
    <!-- 利用可能なゲームスクリプト -->
    <div class="bg-base-200 p-3 rounded">
      <InformationCard class="mb-4">
        <p>デフォルトでは</p>
        <p>basic:なし</p>
        <p>Pro: {{ PRO_SCRIPTS.join(', ') }}</p>
        <p>GOD-MODE: 全種類表示されています</p>
      </InformationCard>

      <div class="grid grid-cols-1 gap-2">
        <label
          v-for="(value, key) in gameMetaMap"
          :key="key"
          class="label cursor-pointer justify-between p-2 rounded text-sm bg-base-300"
        >
          <span class="font-mono">{{ value.name }} / {{ key }}</span>
          <input type="checkbox" class="toggle toggle-warning toggle-sm" :value="key" v-model="gameScripts" />
        </label>
      </div>
    </div>
  </SettingItem>
</template>

<script setup lang="ts">
  import SettingItem from '@config/components/parts/SettingItem.vue'
  import { useFeatureUsageSettings } from './useFeatureUsageSettings'
  import { PRO_SCRIPTS } from '@game/GameScriptsRules'
  import InformationCard from '@shared/components/parts/InformationCard.vue'
  import { gameMetaMap } from '@/types/MetaMaps/'

  const { gameScripts } = useFeatureUsageSettings()
</script>
