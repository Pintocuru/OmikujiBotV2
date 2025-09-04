<!-- src/ConfigMaker/components/parts/SectionCard.vue -->
<template>
  <div class="card bg-base-300 mt-4 z-0">
    <div class="collapse" :class="{ 'collapse-arrow': !alwaysOpen }">
      <!-- 親から制御される開閉状態 -->
      <input type="checkbox" :checked="isOpen" @change="handleToggle" :disabled="alwaysOpen" />
      <div class="collapse-title card-title justify-between" :class="headerClass">
        <div>{{ title }}</div>
        <div v-if="description" class="text-sm pr-2">{{ description }}</div>
      </div>
      <div class="collapse-content">
        <div class="card-body space-y-2 px-2">
          <slot />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { VariantType } from './ItemVariantTypes'

  const props = withDefaults(
    defineProps<{
      title: string
      description?: string
      variant?: VariantType
      isOpen?: boolean
      alwaysOpen?: boolean
    }>(),
    {
      description: '',
      variant: 'secondary',
      isOpen: false,
      alwaysOpen: false,
    }
  )

  // 親コンポーネントに開閉の切り替えを通知
  const emit = defineEmits<{
    toggle: []
  }>()

  const handleToggle = () => {
    if (!props.alwaysOpen) {
      emit('toggle')
    }
  }

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
</script>
