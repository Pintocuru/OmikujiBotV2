<template>
  <component v-if="resolvedIcon" :is="resolvedIcon" :class="sizeClass" />
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import * as Icons from 'lucide-vue-next'

  const props = defineProps<{
    name: string
    size?: number
  }>()

  const resolvedIcon = computed(() => {
    return (Icons as Record<string, any>)[props.name] ?? null
  })

  const sizeClass = computed(() => {
    const s = props.size ?? 6
    return `w-${s} h-${s}`
  })
</script>
