<!-- src/ConfigMaker/components/parts/SettingItem.vue -->
<template>
  <SettingItem
    :label="label"
    :description="description"
    :variant="variant"
    :showReset="showReset"
    :showWarning="showWarning"
    @reset="$emit('reset')"
  >
    <template #default>
      <slot />
    </template>

    <template #label-extra>
      <span v-if="devMemo && isDev" class="badge badge-error badge-sm">{{ devMemo }}</span>
      <LicenseBadge
        v-if="!!forceMode"
        :forceMode="forceMode"
        godTip="貴様!神の力を使えるのか!?"
        proTip="PRO版のみの機能です"
        advTip="Adv版以上の機能です"
      />
    </template>
  </SettingItem>
</template>

<script setup lang="ts">
  import { isDev } from '@/types'
  import LicenseBadge from '@config/components/parts/LicenseBadge.vue'
  import SettingItem from '@shared/components/parts/SettingItem.vue'
  import { DaisyUIColorType } from '@shared/styles/DaisyUiTheme'

  withDefaults(
    defineProps<{
      label: string
      description?: string
      variant?: DaisyUIColorType | null
      showReset?: boolean
      showWarning?: boolean
      devMemo?: string
      forceMode?: 'god' | 'pro' | 'adv'
    }>(),
    {
      showReset: false,
      variant: null,
    }
  )

  defineEmits<{ reset: [] }>()
</script>
