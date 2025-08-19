<!-- src/ConfigMaker/components/parts/SectionCard.vue -->
<template>
  <div class="card bg-base-300 mt-4">
    <!-- ヘッダー -->
    <div class="card-title p-2 pl-4 rounded-t justify-between" :class="headerClass">
      <slot name="header" />
    </div>

    <!-- カードボディ -->
    <div v-if="!isGild" class="card-body space-y-4 p-4">
      <slot name="body" />
    </div>

    <!-- グリッドバージョン(mdで2列) -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
      <slot name="body" />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'

  const props = defineProps<{
    variant?: 'secondary' | 'warning' | 'outline-secondary'
    isGild?: boolean
  }>()

  const headerClass = computed(() => {
    switch (props.variant) {
      case 'warning':
        return 'bg-warning text-warning-content'
      case 'outline-secondary':
        return 'border border-secondary text-secondary'
      case 'secondary':
      default:
        return 'bg-secondary text-secondary-content'
    }
  })
</script>
