<!-- src/MainGenerator/ui/StreamCounter/layouts/PixelBadgePlain.vue -->
<template>
  <div
    class="relative w-32 h-28 flex items-center justify-center overflow-hidden border-6 shadow-xl transition duration-150 pixel-badge bg-base-content"
    :class="`border-${colorPattern}`"
    :style="{ animationDelay: `${index * 0.08}s` }"
  >
    <!-- corner -->
    <span :class="` text-${colorPattern}`">
      <span class="absolute -top-px -left-px w-8 h-8 border-t-6 border-l-6 border-current" />
      <span class="absolute -top-px -right-px w-8 h-8 border-t-6 border-r-6 border-current" />
      <span class="absolute -bottom-px -left-px w-8 h-8 border-b-6 border-l-6 border-current" />
      <span class="absolute -bottom-px -right-px w-8 h-8 border-b-6 border-r-6 border-current" />
    </span>
    <!-- content -->
    <div class="relative flex flex-col items-center justify-center text-base-200">
      <!-- アイコン -->
      <LabelText :label="label" />

      <!-- 数値 -->
      <div class="flex items-baseline justify-center whitespace-nowrap">
        <TransitionGroup
          name="seven-seg"
          tag="span"
          class="inline-flex"
          enter-active-class="transition-all duration-100"
          enter-from-class="opacity-0 scale-250"
          leave-to-class="opacity-0 scale-30"
          leave-active-class="absolute"
        >
          <span :key="value" class="text-4xl font-bold transition-all duration-300">
            {{ value }}
          </span>
        </TransitionGroup>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { type Component } from 'vue'
  import { DaisyUIColorType } from '@shared/styles/DaisyUiTheme'
  import LabelText from './LabelText.vue'

  defineProps<{
    index: number
    label: string | Component
    value: string
    colorPattern: DaisyUIColorType
  }>()
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
