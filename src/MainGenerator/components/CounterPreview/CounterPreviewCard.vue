<!-- CounterDisplay.vue -->
<template>
  <div
    class="mx-auto w-fit min-w-[180px] px-8 py-5 rounded-2xl shadow-xl text-center select-none cursor-pointer bg-gradient-to-br from-primary to-secondary text-primary-content transition-transform duration-200"
    :class="isBouncing && 'scale-110'"
    :data-theme="counter.color"
    @click="increment"
    @contextmenu.prevent="decrement"
  >
    <div class="text-base font-semibold opacity-80 mb-2">
      {{ counter.label }}
    </div>

    <div class="text-7xl font-black leading-none drop-shadow-md">
      {{ value }}
    </div>

    <div class="text-xs mt-3 opacity-80">
      {{ counter.target === 'draw' ? '実行回数' : 'ユーザー数' }}
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, watch } from 'vue'
  import type { SettingsCounterType } from '@/types/OmikujiData/DisplaySettingsSchema'

  const props = defineProps<{
    counter: SettingsCounterType
  }>()

  const value = ref(props.counter.firstValue)
  const isBouncing = ref(false)

  watch(
    () => value.value,
    () => {
      isBouncing.value = true
      setTimeout(() => (isBouncing.value = false), 180)
    }
  )

  const increment = () => {
    value.value++
  }

  const decrement = () => {
    value.value = Math.max(0, value.value - 1)
  }
</script>
