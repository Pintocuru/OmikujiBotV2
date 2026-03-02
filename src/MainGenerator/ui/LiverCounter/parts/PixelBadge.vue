<template>
  <div
    class="relative w-32 h-28 flex items-center justify-center overflow-hidden border-4 border-current shadow-xl transition duration-150 pixel-badge"
    :class="`bg-${colorPattern}-content text-${colorPattern}`"
    :style="{ animationDelay: `${index * 0.08}s` }"
  >
    <!-- corner -->
    <span class="absolute -top-px -left-px w-6 h-6 border-t-4 border-l-4 border-current" />
    <span class="absolute -top-px -right-px w-6 h-6 border-t-4 border-r-4 border-current" />
    <span class="absolute -bottom-px -left-px w-6 h-6 border-b-4 border-l-4 border-current" />
    <span class="absolute -bottom-px -right-px w-6 h-6 border-b-4 border-r-4 border-current" />

    <!-- content -->
    <div class="relative flex flex-col items-center justify-center pt-2">
      <!-- アイコン -->
      <component :is="label" v-if="isComponent" class="w-10 h-10 drop-shadow" />

      <!-- ラベル -->
      <span v-else class="text-2xl font-bold truncate">
        {{ label }}
      </span>

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
  import { type Component, computed } from 'vue'
  import type { BaseVariant } from '@shared/components/parts/ItemVariantTypes'

  const props = defineProps<{
    index: number
    label: string | Component
    value: string
    colorPattern: BaseVariant
  }>()

  const isComponent = computed(() => typeof props.label !== 'string')
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
