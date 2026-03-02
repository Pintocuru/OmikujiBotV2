<!-- C:\_root\_nodejs\OmikenTemplates\templates\OmikujiBot\src\MainGenerator\ui\LiverCounter\parts\MagicalStones.vue -->
<template>
  <div class="flex flex-wrap justify-center gap-6 px-4 py-6">
    <div v-for="key in allKeys" :key="key" class="relative w-30 h-30">
      <div class="petal-inner" :class="`text-${getPattern(key)}`">
        <!-- 中身 -->
        <div
          class="w-full h-full flex flex-col items-center justify-center gap-2"
          :class="`text-${getPattern(key)}-content`"
        >
          <!-- アイコン -->
          <component :is="getLabel(key)" v-if="isComponent(getLabel(key))" class="icon-svg scale-150" />

          <!-- ラベル -->
          <span v-else class="icon-text text-2xl font-bold truncate">
            {{ getLabel(key) }}
          </span>

          <!-- 数値 -->
          <div class="petal-value text-4xl font-bold">
            {{ formatValue(counters[key] ?? 0) }}
          </div>
        </div>

        <!-- ハイライト -->
        <div
          class="absolute top-4 left-6 w-12 h-8 rounded-full bg-white/40 rotate-[-20deg] pointer-events-none blur-[8px]"
        ></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { toRef } from 'vue'
  import type { SettingsLiverCounterType } from '@/types/'
  import { useLiverCounterDisplay } from '../composables/useLiverCounterDisplay'
  import { useLiverLabelResolver } from '../composables/useLiverLabelResolver'

  const props = defineProps<{
    settings: SettingsLiverCounterType
    counters: Record<string, number>
    eventLabels: Record<string, string>
  }>()

  const { getLabel, isComponent } = useLiverLabelResolver(props.eventLabels)
  const { allKeys, getPattern, formatValue } = useLiverCounterDisplay(toRef(props, 'settings'))
</script>

<style scoped>
  .petal-inner {
    width: 100%;
    height: 100%;
    border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%;

    /* DaisyUIテーマ色を使用 */
    background: linear-gradient(135deg, currentColor, color-mix(in srgb, currentColor 70%, white));

    box-shadow:
      0 4px 16px color-mix(in srgb, currentColor 40%, transparent),
      inset 0 1px 1px rgba(255, 255, 255, 0.5);

    animation: petalFloat 4s ease-in-out infinite;
    transition: transform 0.2s ease;
  }

  .flex > div:nth-child(2n) .petal-inner {
    border-radius: 70% 30% 30% 70% / 70% 70% 30% 30%;
    animation-delay: -2s;
  }

  .flex > div:nth-child(3n) .petal-inner {
    border-radius: 50% 50% 30% 70% / 60% 40% 60% 40%;
    animation-delay: -1s;
  }

  /* コンテンツ */
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
</style>
