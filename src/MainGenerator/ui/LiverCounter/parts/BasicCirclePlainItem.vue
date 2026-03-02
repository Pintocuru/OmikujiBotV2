<!-- BasicCircle.vue -->
<template>
  <div class="relative w-32 h-32 flex items-center justify-center">
    <!-- 外側リング -->
    <div class="absolute inset-0 rounded-full opacity-90 shadow-xl" :class="gradientClass"></div>

    <!-- 内側円 -->
    <div
      class="absolute rounded-full w-24 h-24 shadow-inner bg-base-content text-base-200 flex flex-col items-center justify-center"
    >
      <!-- アイコン -->
      <component :is="label" v-if="isComponent" class="w-8 h-8" />
      <!-- ラベル -->
      <div v-else class="text-xl font-bold truncate">{{ label }}</div>

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
          <span :key="value" class="text-3xl font-bold `text-base-200` transition-all duration-300">
            {{ value }}
          </span>
        </TransitionGroup>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { type Component, computed } from 'vue'
  import { BaseVariant } from '@shared/components/parts/ItemVariantTypes'

  const props = defineProps<{
    label: string | Component
    value: string
    colorPattern: BaseVariant | null
  }>()

  const isComponent = computed(() => typeof props.label !== 'string')

  // 外側リング
  const gradientClass = computed(() => {
    const c = props.colorPattern || 'primary'
    return ['bg-gradient-to-br', `from-${c}`, `to-[color-mix(in_srgb,var(--${c})_70%,black)]`].join(' ')
  })
</script>
