<!-- src/configMaker/components/characters/parts/SingleImageMode.vue -->
<template>
  <input
    type="url"
    class="input input-sm w-full"
    :placeholder="`${emotionLabel}の画像URL`"
    :value="value"
    @input="emit('update', ($event.target as HTMLInputElement).value)"
  />
  <ImagePreviewWrapper :layers="value" :size="32" />
</template>

<script setup lang="ts">
  import ImagePreviewWrapper from './ImagePreviewWrapper.vue'

  defineProps<{
    value?: string
    emotionLabel: string
  }>()

  const emit = defineEmits<{
    update: [value: string]
  }>()
</script>
