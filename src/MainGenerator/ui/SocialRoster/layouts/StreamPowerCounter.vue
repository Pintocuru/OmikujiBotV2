<!-- src/MainGenerator/ui/SocialRoster/layouts/StreamPowerCounter.vue -->
<template>
  <div class="flex items-center justify-center gap-1 font-bold">
    <div
      v-for="(digit, i) in digits"
      :key="i"
      class="relative overflow-hidden rounded bg-base-300"
      :style="{ width: size + 'px', height: size * 1.4 + 'px' }"
    >
      <div
        class="absolute left-0 w-full transition-transform duration-500 ease-out"
        :style="{
          transform: `translateY(-${digit * size * 1.4}px)`,
        }"
      >
        <div v-for="n in 10" :key="n" class="flex items-center justify-center" :style="{ height: size * 1.4 + 'px' }">
          {{ n - 1 }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'

  const props = defineProps<{
    value: number
    size?: number
  }>()

  const size = computed(() => props.size ?? 24)

  // 数値 → 桁配列
  const digits = computed(() => {
    return props.value
      .toString()
      .padStart(6, '0') // 桁数は適宜調整
      .split('')
      .map(Number)
  })
</script>
