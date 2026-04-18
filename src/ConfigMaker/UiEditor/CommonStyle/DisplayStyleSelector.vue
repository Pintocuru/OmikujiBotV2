<!-- src/ConfigMaker/UiEditor/CommonStyle/DisplayStyleSelector.vue -->
<template>
  <SettingItem
    v-if="(Object.keys(visibleOptions).length > 1 && !specialSet) || isGod"
    label="表示スタイル"
    description="表示形式を選択"
  >
    <div class="flex flex-wrap gap-2">
      <div
        v-for="(config, key) in visibleOptions"
        :key="key"
        class="badge cursor-pointer"
        :class="modelValue === key ? 'badge-primary' : 'badge-outline'"
        @click="select(key)"
      >
        {{ config?.label }}
      </div>
    </div>
  </SettingItem>
</template>

<script setup lang="ts">
  import { AccessLevelType } from '@shared/types'
  import SettingItem from '@config/components/parts/SettingItem.vue'
  import { useVisibleOptions } from './useVisibleOptions'
  import { useAppStore } from '@main/stores/useAppStore'
  import { computed } from 'vue'
  import { useSettingMode } from '@config/scripts/useAccessCheckerConfig'

  type BaseComponentConfig = {
    label: string
    accessLevel: AccessLevelType
  }

  const props = defineProps<{
    modelValue: string
    options: Record<string, BaseComponentConfig>
  }>()

  const emit = defineEmits<{
    (e: 'update:modelValue', value: string): void
  }>()

  const appStore = useAppStore()
  const { isGod } = useSettingMode()
  // specialSet = null でないなら、表示しない
  const specialSet = computed(() => appStore.data.components.specialSet)
  const { visibleOptions } = useVisibleOptions(props.options)

  function select(key: string) {
    emit('update:modelValue', key)
  }
</script>
