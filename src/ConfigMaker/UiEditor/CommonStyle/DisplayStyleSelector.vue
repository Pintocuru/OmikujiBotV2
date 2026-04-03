<template>
  <SettingItem v-if="visibleOptions.length > 1" label="表示スタイル" description="表示形式を選択">
    <div class="flex flex-wrap gap-2">
      <div
        v-for="[key, config] in visibleOptions"
        :key="key"
        class="badge cursor-pointer"
        :class="modelValue === key ? 'badge-primary' : 'badge-outline'"
        @click="select(key)"
      >
        {{ config.label }}
      </div>
    </div>
  </SettingItem>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { AccessLevelType } from '@shared/types'
  import SettingItem from '@config/components/parts/SettingItem.vue'
  import { useSettingMode } from '@/ConfigMaker/scripts/useAccessCheckerConfig'

  type BaseComponentConfig = {
    label: string
    accessLevel: AccessLevelType
    [key: string]: unknown
  }

  const props = defineProps<{
    modelValue: string
    options: Record<string, BaseComponentConfig>
  }>()

  const emit = defineEmits<{
    (e: 'update:modelValue', value: string): void
  }>()

  const { accessMode } = useSettingMode()

  // アクセスレベル比較用
  const ACCESS_ORDER: AccessLevelType[] = ['none', 'basic', 'adv', 'pro', 'godMode']

  function hasAccess(user: AccessLevelType, required: AccessLevelType) {
    return ACCESS_ORDER.indexOf(user) >= ACCESS_ORDER.indexOf(required)
  }

  // 表示対象だけ抽出
  const visibleOptions = computed(() =>
    Object.entries(props.options).filter(([_, config]) => hasAccess(accessMode.value, config.accessLevel))
  )

  function select(key: string) {
    emit('update:modelValue', key)
  }
</script>
