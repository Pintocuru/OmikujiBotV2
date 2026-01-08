<!-- src\ConfigMaker\components\appInfo\FeatureUsage\FeatureUsageUsage.vue -->
<template>
  <SettingItem label="Recordアイテム表示" description="アイテムの表示・非表示を制御">
    <div class="grid grid-cols-1 gap-2">
      <div v-for="category in recordCategoryLabel" :key="category" class="bg-base-200 p-3 rounded">
        <div class="flex items-center justify-between mb-2">
          <span class="label-text font-medium capitalize">{{ getCategoryDisplayName(category) }}</span>
        </div>
        <div class="flex gap-2 flex-wrap">
          <label v-for="level in AccessLevelLabels" :key="level" class="label cursor-pointer gap-2 text-sm">
            <input
              v-model="categoryVisibility(category).value"
              :value="level"
              type="radio"
              class="radio radio-warning radio-sm"
            />
            <span class="label-text capitalize">{{ level }}</span>
          </label>
        </div>
      </div>
    </div>
  </SettingItem>
</template>

<script setup lang="ts">
  import SettingItem from '@config/components/parts/SettingItem.vue'
  import { categoryLabels, recordCategoryLabel, RecordCategoryType } from '@/types/OmikujiData/'
  import { AccessLevelLabels } from '@shared/types'
  import { useFeatureUsageSettings } from './useFeatureUsageSettings'

  const { categoryVisibility } = useFeatureUsageSettings()

  function getCategoryDisplayName(category: RecordCategoryType): string {
    return `${categoryLabels[category].label} (${category})`
  }
</script>
