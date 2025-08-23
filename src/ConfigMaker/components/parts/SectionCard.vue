<!-- src/ConfigMaker/components/parts/SectionCard.vue -->
<template>
  <div class="card bg-base-300 mt-4">
    <div class="collapse" :class="{ 'collapse-arrow': !alwaysOpen }">
      <!-- v-modelで開閉管理 -->
      <input type="checkbox" v-model="isOpen" :disabled="alwaysOpen" />
      <div class="collapse-title card-title justify-between" :class="headerClass">
        <slot name="header" />
      </div>
      <div class="collapse-content">
        <div class="card-body space-y-2 px-2">
          <slot name="body" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed } from 'vue'

  const props = withDefaults(
    defineProps<{
      variant?: Variant
      isOpen?: boolean
      alwaysOpen?: boolean
    }>(),
    { variant: 'secondary', isOpen: true, alwaysOpen: false }
  )

  const isOpen = ref(props.isOpen)

  const headerClass = computed(() => {
    switch (props.variant) {
      case 'primary':
        return 'bg-primary text-primary-content'
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

      // デフォルトは secondary
      case 'secondary':
      default:
        return 'bg-secondary text-secondary-content'
    }
  })

  type BaseVariant = 'primary' | 'secondary' | 'info' | 'success' | 'warning' | 'error'

  type OutlineVariant =
    | 'outline-primary'
    | 'outline-secondary'
    | 'outline-info'
    | 'outline-success'
    | 'outline-warning'
    | 'outline-error'

  type Variant = BaseVariant | OutlineVariant
</script>
