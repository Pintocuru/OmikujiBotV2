<!-- src\ConfigMaker\components\appInfo\FeatureUsage\FeatureUsageComponents.vue -->
<template>
  <SettingItem label="コンポーネント設定" description="ジェネレーターのコンポーネント表示制御">
    <!-- 利用可能なコンポーネント -->
    <div class="bg-base-200 p-3 rounded">
      <InformationCard class="mb-4">
        <p>デフォルトでは</p>
        <p>basic:{{ BASIC_COMPONENTS.join(', ') }}</p>
        <p>Pro: {{ PRO_COMPONENTS.join(', ') }}</p>
        <p>GOD-MODE: 全種類表示されています</p>
      </InformationCard>

      <div class="grid grid-cols-1 gap-2">
        <label
          v-for="(label, key) in componentLabels"
          :key="key"
          class="label cursor-pointer justify-between p-2 rounded text-sm bg-base-300"
        >
          <span class="font-mono">{{ label }} / {{ key }}</span>
          <input type="checkbox" class="toggle toggle-warning toggle-sm" :value="key" v-model="components" />
        </label>
      </div>
    </div>
  </SettingItem>
</template>

<script setup lang="ts">
  import SettingItem from '@ConfigComponents/parts/SettingItem.vue'
  import { useFeatureUsageSettings } from './useFeatureUsageSettings'
  import { componentLabels } from '@/types'
  import InformationCard from '@shared/components/parts/InformationCard.vue'
  import { BASIC_COMPONENTS, PRO_COMPONENTS } from '../../componentEditor/componentRules'

  const { components } = useFeatureUsageSettings()
</script>
