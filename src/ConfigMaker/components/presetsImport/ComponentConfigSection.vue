<!-- src\ConfigMaker\components\presetsImport\ComponentConfigSection.vue -->
<template>
  <div class="bg-base-200 rounded-lg p-3">
    <div class="flex items-center justify-between mb-2">
      <div class="flex items-center gap-2">
        <input type="checkbox" :checked="config.enabled" @change="handleEnabledChange" class="checkbox checkbox-sm" />
        <span class="font-medium">{{ componentLabels[component] }}</span>
      </div>
    </div>

    <div v-if="config.enabled" class="ml-6 space-y-2">
      <div class="flex items-center gap-4">
        <span class="text-sm">使用する設定:</span>
        <div class="flex gap-2">
          <label class="flex items-center gap-1">
            <input
              type="radio"
              :name="`component-${component}`"
              :checked="!config.useImported"
              @change="() => handleUseChange(false)"
              class="radio radio-sm"
            />
            <span class="text-sm">既存の設定</span>
          </label>
          <label class="flex items-center gap-1">
            <input
              type="radio"
              :name="`component-${component}`"
              :checked="config.useImported"
              @change="() => handleUseChange(true)"
              class="radio radio-sm"
            />
            <span class="text-sm">読み込み側の設定</span>
          </label>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { componentLabels, SettingsComponentsCondition } from '@/types/OmikujiData/ComponentsSchema'
  import { useImportManager } from './composables/useImportManager'
  import { ComponentImportConfig } from './ImportTypes'

  const props = defineProps<{
    component: SettingsComponentsCondition
    config: ComponentImportConfig
    importManager: ReturnType<typeof useImportManager>
  }>()

  const handleEnabledChange = (event: Event) => {
    const enabled = (event.target as HTMLInputElement).checked
    props.importManager.updateComponentConfig(props.component, { enabled })
  }

  const handleUseChange = (useImported: boolean) => {
    props.importManager.updateComponentConfig(props.component, { useImported })
  }
</script>
