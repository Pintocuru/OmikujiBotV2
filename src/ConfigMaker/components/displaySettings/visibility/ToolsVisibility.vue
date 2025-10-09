<!-- src\ConfigMaker\components\displaySettings\visibility\ToolsVisibility.vue -->
<template>
  <SettingItem label="ツール系設定" description="便利系コンポーネントの表示制御">
    <div class="bg-base-200 p-3 rounded">
      <div class="flex items-center justify-between mb-2">
        <span class="label-text font-medium">WordPartyリスト</span>
      </div>
      <div class="flex gap-2 flex-wrap">
        <label v-for="level in AccessLevelLabels" :key="level" class="label cursor-pointer gap-2 text-sm">
          <input v-model="wordPartySettings" :value="level" type="radio" class="radio radio-warning radio-sm" />
          <span class="label-text capitalize">{{ level }}</span>
        </label>
      </div>
    </div>
  </SettingItem>
</template>

<script setup lang="ts">
  import SettingItem from '@ConfigComponents/parts/SettingItem.vue'
  import { AccessLevelLabels } from '@shared/types'
  import { useVisibilitySettings } from './useVisibilitySettings'

  const { wordPartySettings } = useVisibilitySettings()
</script>
