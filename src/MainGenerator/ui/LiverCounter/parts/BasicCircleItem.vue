<!-- src/MainGenerator/ui/LiverCounter/parts/BasicCircleItem.vue -->
<template>
  <div
    class="w-24 h-24 rounded-full flex flex-col items-center justify-center shadow-md text-base-100"
    :class="bgClass"
  >
    <!-- lucide コンポーネントの場合はアイコンを描画 -->
    <component :is="label" v-if="isComponent" class="w-6 h-6" />
    <!-- string の場合はそのまま表示 -->
    <div v-else class="text-lg font-bold">{{ label }}</div>
    <div class="text-xl">{{ formatted }}</div>
  </div>
</template>

<script setup lang="ts">
  import { computed, type Component } from 'vue'

  const props = defineProps<{
    label: string | Component
    value: number
    colorPattern?: string | null
  }>()

  // オブジェクト（コンポーネント定義）かどうかで判定
  const isComponent = computed(() => typeof props.label !== 'string')

  const formatted = computed(() => {
    return new Intl.NumberFormat().format(props.value)
  })

  const bgClass = computed(() => {
    return props.colorPattern
      ? `bg-${props.colorPattern} text-${props.colorPattern}-content`
      : 'bg-primary text-primary-content'
  })
</script>
