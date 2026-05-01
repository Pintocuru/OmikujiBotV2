<!-- src/ConfigMaker/components/presetsImport/ComponentConfigSection.vue -->
span<!-- src/ConfigMaker/components/presetsImport/ComponentConfigSection.vue -->
<template>
  <div class="bg-base-200 rounded-lg p-3">
    <div class="flex items-center justify-between mb-2">
      <div class="flex items-center gap-2">
        <input type="checkbox" :checked="config.enabled" @change="handleEnabledChange" class="checkbox checkbox-sm" />
        <span>{{ uiKindMap[componentKey].label }}</span>
        <span v-if="isImportOnly" class="badge badge-sm badge-info">新規</span>
      </div>
    </div>

    <div v-if="config.enabled" class="ml-6 space-y-2">
      <div class="flex items-center gap-4">
        <span class="text-sm">使用する設定:</span>
        <div class="flex gap-2">
          <!-- 読み込み側にのみある設定は「既存の設定」選択肢を表示しない -->
          <label v-if="!isImportOnly" class="flex items-center gap-1">
            <label class="flex items-center gap-1">
              <input
                type="radio"
                :name="`component-${componentKey}`"
                :checked="config.useImported"
                @change="() => handleUseChange(true)"
                class="radio radio-sm"
              />
              <span class="text-sm">読み込み側の設定</span>
            </label>
            <input
              type="radio"
              :name="`component-${componentKey}`"
              :checked="!config.useImported"
              @change="() => handleUseChange(false)"
              class="radio radio-sm"
            />
            <span class="text-sm">既存の設定</span>
          </label>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { uiKindMap, UiKind } from '@/types'
  import { useImportManager } from './composables/useImportManager'
  import { ComponentImportConfig } from './ImportTypes'

  const props = defineProps<{
    componentKey: UiKind
    config: ComponentImportConfig
    /** true: 読み込み側にのみ存在するキー（既存設定なし） */
    isImportOnly: boolean
    importManager: ReturnType<typeof useImportManager>
  }>()

  const handleEnabledChange = (event: Event) => {
    const enabled = (event.target as HTMLInputElement).checked
    props.importManager.updateComponentConfig(props.componentKey, { enabled })
  }

  const handleUseChange = (useImported: boolean) => {
    props.importManager.updateComponentConfig(props.componentKey, { useImported })
  }
</script>
