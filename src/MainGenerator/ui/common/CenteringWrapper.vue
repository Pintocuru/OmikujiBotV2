<!-- CenteringWrapper.vue -->
<template>
  <div :class="containerClass">
    <slot />
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { storeToRefs } from 'pinia'
  import { useAppStore } from '@/MainGenerator/stores/useAppStore'

  const appStore = useAppStore()
  const { data } = storeToRefs(appStore)

  const uiPlacement = computed(() => data.value.settings.uiPlacement)
  const specialSet = computed(() => data.value.components.specialSet)

  const containerClass = computed(() => {
    if (uiPlacement.value === 'center' && specialSet.value === null) {
      return 'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full flex justify-center'
    }
    return ''
  })
</script>
