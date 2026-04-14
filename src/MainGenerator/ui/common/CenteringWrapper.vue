<!-- CenteringWrapper.vue -->
<template>
  <div :class="containerClass">
    <slot />
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { useAppStore } from '@/MainGenerator/stores/useAppStore'

  const appStore = useAppStore()

  const uiPlacement = computed(() => appStore.data.settings.uiPlacement)
  const specialSet = computed(() => appStore.data.components.specialSet)

  const containerClass = computed(() => {
    if (uiPlacement.value === 'center' && specialSet.value === null) {
      return 'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full flex justify-center'
    }
    return ''
  })
</script>
