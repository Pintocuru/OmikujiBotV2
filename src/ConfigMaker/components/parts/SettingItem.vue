<!-- src/ConfigMaker/components/display/SettingItem.vue -->
<template>
  <SettingItem
    :label="label"
    :description="description"
    :variant="variant"
    :showReset="showReset"
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
      />
    </template>
  </SettingItem>
</template>

<script setup lang="ts">
  import { isDev } from '@/types'
  import LicenseBadge from '@ConfigComponents/parts/LicenseBadge.vue'
  import SettingItem from '@shared/components/parts/SettingItem.vue'
  import type { VariantType } from '@shared/components/parts/ItemVariantTypes'

  const props = withDefaults(
    defineProps<{
      label: string
      description?: string
      variant?: VariantType
      showReset?: boolean
      devMemo?: string
      forceMode?: 'god' | 'pro'
    }>(),
    {
      showReset: false,
      variant: 'none',
    }
  )

  defineEmits<{ reset: [] }>()
</script>
