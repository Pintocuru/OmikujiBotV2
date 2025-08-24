<!-- src/ConfigMaker/components/display/SettingItem.vue -->
<template>
  <div class="flex items-center gap-4 px-4 py-2 rounded-md" :class="headerClass">
    <div class="flex flex-col gap-1 min-w-1/3 sm:min-w-1/4">
      <label class="label-text font-bold">
        {{ label }}
        <!-- Licenseバッジ -->
        <span v-if="devMemo && isDev" class="badge badge-error badge-sm">{{ devMemo }}</span>
        <!-- Licenseバッジ -->
        <LicenseBadge
          v-if="!!forceMode"
          :forceMode="forceMode"
          godTip="貴様!神の力を使えるのか!?"
          proTip="PRO版のみの機能です"
        />
      </label>
      <span v-if="description" class="text-xs">
        {{ description }}
      </span>
    </div>
    <div class="flex-1">
      <slot />
    </div>
    <button v-if="showReset" class="btn btn-ghost btn-xs" @click="$emit('reset')" title="デフォルト値に戻す">
      <RotateCcw class="w-3 h-3" />
    </button>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { isDev } from '@/types'
  import { VariantType } from './ItemVariantTypes'
  import LicenseBadge from '@ConfigComponents/parts/LicenseBadge.vue'
  import { RotateCcw } from 'lucide-vue-next'

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

  defineEmits<{
    reset: []
  }>()

  const headerClass = computed(() => {
    switch (props.variant) {
      case 'primary':
        return 'bg-primary text-primary-content'
      case 'secondary':
        return 'bg-secondary text-secondary-content'
      case 'info':
        return 'bg-info text-success-info'
      case 'success':
        return 'bg-success text-success-content'
      case 'warning':
        return 'bg-warning text-warning-content'
      case 'error':
        return 'bg-error text-error-content'

      case 'outline-primary':
        return 'border border-primary text-primary'
      case 'outline-secondary':
        return 'border border-secondary text-secondary'
      case 'outline-info':
        return 'border border-info text-info'
      case 'outline-success':
        return 'border border-success text-success'
      case 'outline-warning':
        return 'border border-warning text-warning'
      case 'outline-error':
        return 'border border-error text-error'

      case 'none':
      default:
        return 'bg-base-200 text-base-content'
    }
  })
</script>
