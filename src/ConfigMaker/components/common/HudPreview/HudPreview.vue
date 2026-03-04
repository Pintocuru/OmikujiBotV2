<template>
  <div :class="[maxHeightClass, 'overflow-y-hidden relative']">
    <div :style="bgStyle" class="w-full h-full">
      <slot />

      <template v-if="(isAdminOnly && isDev) || !isAdminOnly">
        <!-- Hue -->
        <input type="range" min="0" max="360" v-model="hue" class="range range-xs absolute bottom-8 left-2 w-28" />

        <!-- Lightness -->
        <input
          type="range"
          min="0"
          max="100"
          v-model="lightness"
          class="range range-xs absolute bottom-2 left-2 w-28"
        />
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { isDev } from '@/types'
  import { ref, computed } from 'vue'

  withDefaults(
    defineProps<{
      maxHeightClass?: string
      isAdminOnly?: boolean
    }>(),
    {
      maxHeightClass: 'max-h-56',
      isAdminOnly: false,
    }
  )

  const hue = ref(200)
  const lightness = ref(50)

  const bgStyle = computed(() => ({
    backgroundColor: `hsl(${hue.value} 60% ${lightness.value}%)`,
  }))
</script>
