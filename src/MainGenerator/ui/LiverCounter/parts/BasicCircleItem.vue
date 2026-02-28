<template>
  <div
    class="w-24 h-24 rounded-full flex flex-col items-center justify-center shadow-md text-base-100"
    :class="bgClass"
  >
    <div class="text-lg font-bold">{{ label }}</div>
    <div class="text-xl">{{ formatted }}</div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'

  const props = defineProps<{
    label: string
    value: number
    colorPattern?: string | null
  }>()

  const formatted = computed(() => {
    return new Intl.NumberFormat().format(props.value)
  })

  const bgClass = computed(() => {
    return props.colorPattern ? `bg-${props.colorPattern}` : 'bg-primary'
  })
</script>
