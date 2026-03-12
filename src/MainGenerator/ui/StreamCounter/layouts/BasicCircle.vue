<!-- src/MainGenerator/ui/StreamCounter/layouts/BasicCircle.vue -->
<template>
  <div class="relative w-32 h-32 flex items-center justify-center transition duration-150 pixel-badge">
    <!-- 外側リング -->
    <div class="absolute inset-0 rounded-full opacity-90 shadow-xl" :class="gradientClass"></div>

    <!-- 内側円 -->
    <div
      class="absolute rounded-full w-24 h-24 shadow-inner flex flex-col items-center justify-center"
      :class="[innerBgClass]"
    >
      <!-- アイコン -->
      <LabelText :label="label" />

      <!-- カウント表示 -->
      <div class="flex items-baseline justify-center whitespace-nowrap">
        <TransitionGroup
          name="count"
          tag="span"
          class="inline-flex"
          enter-active-class="transition-all duration-500"
          enter-from-class="opacity-0 scale-90 -translate-y-5"
          leave-to-class="opacity-0 scale-90 translate-y-5"
          leave-active-class="absolute"
        >
          <span :key="value" class="text-4xl font-bold transition-all duration-300" :class="[textClass]">
            {{ value }}
          </span>
        </TransitionGroup>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { type Component, computed } from 'vue'
  import LabelText from './LabelText.vue'
  import { DaisyUIColorType } from '@shared/styles/DaisyUiTheme'

  const props = defineProps<{
    label: string | Component
    value: string
    colorPattern: DaisyUIColorType | null
  }>()

  const colorToken = computed(() => props.colorPattern || 'primary')

  // 内側円の背景色
  const innerBgClass = computed(() => `bg-${colorToken.value}-content text-${colorToken.value}`)

  // 外側リング
  const gradientClass = computed(() => {
    const c = props.colorPattern || 'primary'
    return ['bg-gradient-to-br', `from-${c}`, `to-${c}-content`].join(' ')
  })

  // テキストカラー
  const textClass = computed(() => `text-${colorToken.value}`)
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
