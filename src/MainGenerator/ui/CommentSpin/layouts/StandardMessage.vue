<!-- MessageText.vue -->
<template>
  <div
    class="flex items-center justify-center whitespace-nowrap font-bold tracking-wide"
    :class="[sizeClass, colorClass]"
  >
    {{ message }}
  </div>
</template>

<script setup lang="ts">
  const props = defineProps<{
    message: string
    size?: 'normal' | 'large'
    color?: string
  }>()

  const sizeClass = props.size === 'large' ? 'text-5xl' : 'text-base'
  const colorClass = props.color ?? 'text-base-content'
</script>
