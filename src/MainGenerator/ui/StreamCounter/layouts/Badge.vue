<!-- src/MainGenerator/ui/StreamCounter/layouts/Badge.vue -->
<template>
  <div class="flex items-center justify-center transition duration-150 pixel-badge">
    <!-- ラベル（アイコン or テキスト） -->

    <!-- DaisyUI Badge カウンター -->
    <div class="badge badge-xl gap-2 shadow-md" :class="badgeClass">
      <LabelText :label="label" />
      <span class="text-2xl font-bold">{{ value }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { type Component, computed } from 'vue'
  import { DaisyUIColorType } from '@shared/styles/DaisyUiTheme'
  import LabelText from './LabelText.vue'

  const props = defineProps<{
    label: string | Component
    value: string
    colorPattern: DaisyUIColorType | null
  }>()

  // DaisyUI Badge のカラークラス
  const badgeClass = computed(() => {
    const c = props.colorPattern || 'primary'
    return `badge-${c}`
  })
</script>

<style scoped>
  .pixel-badge {
    animation: badgeDrop 0.4s cubic-bezier(0.22, 1, 0.36, 1) both;
  }

  @keyframes badgeDrop {
    from {
      opacity: 0;
      transform: translateY(-10px) scale(0.9);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }
</style>
