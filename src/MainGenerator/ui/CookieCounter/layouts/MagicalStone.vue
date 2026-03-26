<!-- src/MainGenerator/ui/StreamCounter/layouts/MagicalStone.vue -->
<template>
  <div class="magic-burst relative w-30 h-30" :class="getNthClass(index)">
    <div class="w-full h-full flex petal-inner" :class="`text-${activeColor}`">
      <!-- 中身 -->
      <div class="w-full h-full flex flex-col items-center justify-center gap-2" :class="`text-${activeColor}-content`">
        <!-- アイコン -->
        <LabelText :label="label" />

        <!-- 数値 -->
        <div class="flex items-baseline justify-center whitespace-nowrap">
          <TransitionGroup
            name="matrix"
            tag="span"
            class="inline-flex"
            enter-active-class="transition-all duration-200"
            enter-from-class="opacity-0 scale-50"
            leave-to-class="opacity-0 scale-150"
            leave-active-class="absolute"
          >
            <span :key="value" class="text-4xl font-bold">
              {{ value }}
            </span>
          </TransitionGroup>
        </div>
      </div>

      <!-- ハイライト -->
      <div
        class="absolute top-4 left-6 w-12 h-8 rounded-full bg-white/40 rotate-[-20deg] pointer-events-none blur-[8px]"
      ></div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { type Component, ref, watch } from 'vue'
  import LabelText from './LabelText.vue'
  import { DaisyUIColorType, daisyUIColor } from '@shared/styles/DaisyUiTheme'

  const props = defineProps<{
    index: number
    label: string | Component
    value: string
    colorPattern: DaisyUIColorType
  }>()

  // nth-child による border-radius 変化を index で代替
  const getNthClass = (i: number): string => {
    if (i % 3 === 2) return 'petal-variant-3'
    if (i % 2 === 1) return 'petal-variant-2'
    return ''
  }

  const activeColor = ref<DaisyUIColorType>(props.colorPattern)

  const toNum = (v: string) => Number(v.replace(/,/g, ''))
  let prev = toNum(props.value)

  watch(
    () => props.value,
    (v) => {
      const next = toNum(v)
      if (next > prev) {
        const random = daisyUIColor[Math.floor(Math.random() * daisyUIColor.length)]
        activeColor.value = random
      }
      prev = next
    }
  )
</script>

<style scoped>
  .petal-inner {
    border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%;

    background: linear-gradient(135deg, currentColor, color-mix(in srgb, currentColor 70%, white));

    box-shadow:
      0 4px 16px color-mix(in srgb, currentColor 40%, transparent),
      inset 0 1px 1px rgba(255, 255, 255, 0.5);

    animation: petalFloat 4s ease-in-out infinite;
    transition: transform 0.2s ease;
  }

  .petal-variant-2 :deep(.petal-inner) {
    border-radius: 70% 30% 30% 70% / 70% 70% 30% 30%;
    animation-delay: -2s;
  }

  .petal-variant-3 :deep(.petal-inner) {
    border-radius: 50% 50% 30% 70% / 60% 40% 60% 40%;
    animation-delay: -1s;
  }
  .icon-svg {
    color: hsl(var(--pc));
    filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.2));
  }

  .icon-text {
    color: hsl(var(--pc));
  }

  .petal-value {
    color: hsl(var(--pc));
    text-shadow: 0 1px 3px rgba(0, 0, 0, 0.25);
  }

  @keyframes petalFloat {
    0%,
    100% {
      transform: translateY(0px) rotate(0deg);
    }
    50% {
      transform: translateY(-4px) rotate(1.5deg);
    }
  }

  .magic-burst {
    animation: magicFlash 0.3s ease;
  }

  @keyframes magicFlash {
    0% {
      transform: scale(1);
      filter: brightness(1);
    }
    50% {
      transform: scale(1.1);
      filter: brightness(1.4);
    }
    100% {
      transform: scale(1);
      filter: brightness(1);
    }
  }
</style>
