<!-- src\ConfigMaker\components\displaySettings\visibility\ComponentSpecificVisibility.vue -->
<template>
  <SettingItem label="コンポーネント固有設定" description="特定コンポーネント内の要素の表示制御">
    <div class="space-y-3">
      <!-- characterVisible 設定 -->
      <div class="bg-base-200 p-3 rounded">
        <div class="flex items-center justify-between mb-2">
          <span class="label-text font-medium">キャラクター表示 (characterVisible)</span>
        </div>
        <div class="flex gap-2 flex-wrap">
          <label v-for="level in AccessLevelLabels" :key="level" class="label cursor-pointer gap-2 text-sm">
            <input v-model="characterVisible" :value="level" type="radio" class="radio radio-warning radio-sm" />
            <span class="label-text capitalize">{{ level }}</span>
          </label>
        </div>
      </div>

      <!-- wordPartyLoading 設定 -->
      <div class="bg-base-200 p-3 rounded">
        <div class="flex items-center justify-between mb-2">
          <span class="label-text font-medium">WordParty読み込み機能 (wordPartyLoading)</span>
        </div>
        <div class="flex gap-2 flex-wrap">
          <label v-for="level in AccessLevelLabels" :key="level" class="label cursor-pointer gap-2 text-sm">
            <input v-model="wordPartyLoading" :value="level" type="radio" class="radio radio-warning radio-sm" />
            <span class="label-text capitalize">{{ level }}</span>
          </label>
        </div>
      </div>

      <!-- licenseVisible 設定 -->
      <div class="bg-base-200 p-3 rounded">
        <div class="flex items-center justify-between mb-2">
          <span class="label-text font-medium">ライセンス記入表示 (licenseVisible)</span>
        </div>
        <div class="flex gap-2 flex-wrap">
          <label v-for="level in AccessLevelLabels" :key="level" class="label cursor-pointer gap-2 text-sm">
            <input v-model="licenseVisible" :value="level" type="radio" class="radio radio-warning radio-sm" />
            <span class="label-text capitalize">{{ level }}</span>
          </label>
        </div>
      </div>
    </div>
  </SettingItem>
</template>

<script setup lang="ts">
  import SettingItem from '@ConfigComponents/parts/SettingItem.vue'
  import { AccessLevelLabels } from '@shared/types'
  import { useVisibilitySettings } from './useVisibilitySettings'

  const { characterVisible, wordPartyLoading, licenseVisible } = useVisibilitySettings()
</script>
