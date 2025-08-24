<!-- src/ConfigMaker/components/parts/InformationCard.vue -->
<template>
  <!-- 補足説明 -->
  <div class="alert w-full" :class="headerClass">
    <Info class="w-5 h-5 mt-0.5 shrink-0" />
    <div class="space-y-1">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { BaseVariant } from './ItemVariantTypes'
  import { Info } from 'lucide-vue-next'

  const props = withDefaults(
    defineProps<{
      variant?: BaseVariant
    }>(),
    { variant: 'info' }
  )

  const headerClass = computed(() => {
    switch (props.variant) {
      case 'primary':
        return 'alert-primary text-primary-content'
      case 'info':
        return 'alert-info text-success-info'
      case 'success':
        return 'alert-success text-success-content'
      case 'warning':
        return 'alert-warning text-warning-content'
      case 'error':
        return 'alert-error text-error-content'

      // デフォルトは info
      case 'info':
      default:
        return 'alert-info text-info-content'
    }
  })
</script>
