<!-- src/ConfigMaker/components/appInfo/FlagsSettings/UsageUsageSettings.vue -->
<template>
  <SubSectionHeader icon="Palette" title="Recordアイテム表示" description="アイテムの表示・非表示を制御" />

  <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
    <SettingItem
      v-for="category in recordCategoryLabel"
      :key="category"
      :label="categoryMap[category].label"
      :description="category"
      :variant="getVariant(category)"
    >
      <div class="flex gap-2 flex-wrap">
        <label v-for="level in AccessLevelLabels" :key="level" class="label cursor-pointer gap-2 text-sm">
          <input
            v-model="categoryVisibility(category).value"
            :value="level"
            type="radio"
            class="radio radio-warning radio-sm"
          />
          <span class="label-text capitalize">
            {{ level }}
          </span>
        </label>
      </div>
    </SettingItem>
  </div>
</template>

<script setup lang="ts">
  import SettingItem from '@config/components/parts/SettingItem.vue'
  import { categoryMap, recordCategoryLabel, RecordCategoryType } from '@/types/'
  import { AccessLevelLabels } from '@shared/types'
  import { useFlagsSettings } from './useFlagsSettings'
  import SubSectionHeader from '@shared/components/parts/SubSectionHeader.vue'
  import { DaisyUIColorType } from '@shared/styles/DaisyUiTheme'

  const { categoryVisibility } = useFlagsSettings()

  const levelVariantMap: Record<(typeof AccessLevelLabels)[number], DaisyUIColorType | null> = {
    none: 'neutral',
    basic: null,
    adv: 'info',
    pro: 'accent',
    godMode: 'warning',
  }

  const getVariant = (category: RecordCategoryType): DaisyUIColorType | null => {
    const level = categoryVisibility(category).value
    return levelVariantMap[level]
  }
</script>
