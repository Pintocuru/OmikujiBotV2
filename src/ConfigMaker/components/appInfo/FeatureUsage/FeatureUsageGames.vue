<!-- C:\_root\_nodejs\OmikenTemplates\templates\OmikujiBot\src\ConfigMaker\components\appInfo\FeatureUsage\FeatureUsageGames.vue -->
<template>
  <SettingItem label="ゲームスクリプト設定" description="ゲームスクリプト関連の表示制御">
    <!-- 利用可能なゲームスクリプト -->
    <div class="bg-base-200 p-3 rounded">
      <div class="mb-2">
        <span class="label-text font-medium">利用可能なゲームスクリプト</span>
      </div>
      <div class="grid grid-cols-1 gap-2">
        <label
          v-for="(scriptPreset, scriptId) in gameScriptMap"
          :key="scriptId"
          class="label cursor-pointer justify-between p-2 rounded text-sm bg-base-300"
        >
          <span class="font-mono">{{ scriptPreset.name }} / {{ scriptId }}</span>
          <input type="checkbox" class="toggle toggle-warning toggle-sm" :value="scriptId" v-model="gameScripts" />
        </label>
      </div>
    </div>
  </SettingItem>
</template>

<script setup lang="ts">
  import SettingItem from '@ConfigComponents/parts/SettingItem.vue'
  import { gameScriptMap } from '@/GameScripts/GameScriptsMap'
  import { useFeatureUsageSettings } from './useFeatureUsageSettings'

  const { gameScripts } = useFeatureUsageSettings()
</script>
