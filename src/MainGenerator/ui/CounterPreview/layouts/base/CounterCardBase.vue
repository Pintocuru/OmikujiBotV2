<!-- src/MainGenerator/ui/CounterPreview/layouts/base/CounterCardBase.vue -->
<template>
  <div
    class="w-full p-2 rounded-2xl text-center space-y-2 font-semibold transition-transform duration-200"
    :class="[
      isBouncing && 'scale-110',
      `text-${counterSetting.color.backFrom}-content`,
      counterSetting.color.backFrom === counterSetting.color.backTo
        ? `bg-${counterSetting.color.backFrom}`
        : ['bg-gradient-to-br', `from-${counterSetting.color.backFrom}`, `to-${counterSetting.color.backTo}`],
    ]"
    :data-theme="counterSetting.color.daisyUiTheme"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
  import { CounterPreviewType } from '@/types'

  defineProps<{
    counterSetting: CounterPreviewType
    isBouncing?: boolean
  }>()
</script>
