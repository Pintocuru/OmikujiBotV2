<!-- src\ConfigMaker\components\displaySettings\visibility\ToolsVisibility.vue -->

<template>
  <SettingItem label="コンポーネント固有設定" description="特定コンポーネント内の要素の表示制御">
    <div class="space-y-3">
      <template v-for="item in settings" :key="item.key">
        <div class="bg-base-200 p-3 rounded">
          <div class="flex items-center justify-between mb-2">
            <span class="label-text font-medium">{{ item.label }}</span>
          </div>
          <div class="flex gap-2 flex-wrap">
            <label v-for="level in AccessLevelLabels" :key="level" class="label cursor-pointer gap-2 text-sm">
              <input v-model="item.model.value" :value="level" type="radio" class="radio radio-warning radio-sm" />
              <span class="label-text capitalize">{{ level }}</span>
            </label>
          </div>
        </div>
      </template>
    </div>
  </SettingItem>
</template>

<script setup lang="ts">
  import { useVisibilitySettings } from './useVisibilitySettings'
  import SettingItem from '@ConfigComponents/parts/SettingItem.vue'
  import { AccessLevelLabels } from '@shared/types'

  const { wordPartySettings, jsonMergeSettings } = useVisibilitySettings()

  const settings = [
    { key: 'jsonMergeSettings', label: 'Jsonマージ機能(Dev)', model: jsonMergeSettings },
    { key: 'wordPartySettings', label: 'WordPartyリスト', model: wordPartySettings },
  ]
</script>
