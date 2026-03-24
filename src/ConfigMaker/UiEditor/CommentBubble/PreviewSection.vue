<!-- src/ConfigMaker/UiEditor/CommentBubble/PreviewSection.vue -->
<template>
  <div class="flex-1 min-w-0">
    <div
      class="text-sm font-semibold mb-2 text-center border-b pb-1"
      :class="[colorClass === 'primary' ? 'text-primary border-primary/50' : 'text-secondary border-secondary/50']"
    >
      {{ title }}
    </div>
    <div class="flex flex-col items-center">
      <div class="flex justify-center min-h-[50px]">
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  defineProps<{
    title: string
    colorClass: 'primary' | 'secondary'
  }>()
</script>
