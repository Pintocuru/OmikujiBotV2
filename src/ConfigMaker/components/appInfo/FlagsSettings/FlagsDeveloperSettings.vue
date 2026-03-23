<!-- src/ConfigMaker/components/appInfo/FlagsSettings/FlagsDeveloperSettings.vue -->
<template>
  <SubSectionHeader icon="Sliders" title="アイテム固有設定" description="特定アイテム内の要素の表示制御" />

  <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
    <SettingItem
      v-for="item in settings"
      :key="item.key"
      :label="item.label"
      :description="item.key"
      :variant="levelVariantMap[item.model.value]"
    >
      <div class="flex gap-2 flex-wrap">
        <label v-for="level in AccessLevelLabels" :key="level" class="label cursor-pointer gap-2 text-sm">
          <input v-model="item.model.value" :value="level" type="radio" class="radio radio-warning radio-sm" />
          <span class="label-text capitalize">
            {{ level }}
          </span>
        </label>
      </div>
    </SettingItem>
  </div>
</template>

<script setup lang="ts">
  import { useFlagsSettings } from './useFlagsSettings'
  import SettingItem from '@config/components/parts/SettingItem.vue'
  import { AccessLevelLabels } from '@shared/types'
  import SubSectionHeader from '@shared/components/parts/SubSectionHeader.vue'
  import { DaisyUIColorType } from '@shared/styles/DaisyUiTheme'

  const { licenseVisible, jsonMergeSettings, itemSlotEnabled } = useFlagsSettings()

  const settings = [
    { key: 'licenseVisible', label: 'ライセンス記入表示 ', model: licenseVisible },
    { key: 'jsonMergeSettings', label: 'Jsonマージ機能(Dev)', model: jsonMergeSettings },
    { key: 'itemSlotEnabled', label: 'アイテム表示設定の表示', model: itemSlotEnabled },
  ]

  const levelVariantMap: Record<(typeof AccessLevelLabels)[number], DaisyUIColorType | null> = {
    none: 'neutral',
    basic: null,
    adv: 'info',
    pro: 'accent',
    godMode: 'warning',
  }
</script>
