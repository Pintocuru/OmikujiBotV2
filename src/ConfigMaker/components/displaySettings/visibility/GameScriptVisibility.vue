<!-- src\ConfigMaker\components\displaySettings\visibility\GameScriptVisibility.vue -->
<template>
  <SettingItem label="ゲームスクリプト設定" description="ゲームスクリプト関連の表示制御">
    <div class="space-y-3">
      <!-- ゲームスクリプト設定UI表示制御 -->
      <div class="bg-base-200 p-3 rounded">
        <div class="flex items-center justify-between mb-2">
          <span class="label-text font-medium">ゲームスクリプトの設定UI</span>
        </div>
        <div class="flex gap-2 flex-wrap">
          <label v-for="level in AccessLevelLabels" :key="level" class="label cursor-pointer gap-2 text-sm">
            <input v-model="gameScriptSettings" :value="level" type="radio" class="radio radio-warning radio-sm" />
            <span class="label-text capitalize">{{ level }}</span>
          </label>
        </div>
      </div>

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
    </div>
  </SettingItem>
</template>

<script setup lang="ts">
  import SettingItem from '@ConfigComponents/parts/SettingItem.vue'
  import { gameScriptMap } from '@/common/GameScripts/GameScriptsMap'
  import { AccessLevelLabels } from '@shared/types'
  import { useVisibilitySettings } from './useVisibilitySettings'

  const { gameScriptSettings, gameScripts } = useVisibilitySettings()
</script>
