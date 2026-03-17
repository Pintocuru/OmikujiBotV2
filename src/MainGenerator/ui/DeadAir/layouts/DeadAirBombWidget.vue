<!-- src/MainGenerator/ui/DeadAir/layouts/DeadAirBombWidget.vue -->
<template>
  <div
    class="relative flex items-center justify-center w-[400px] h-[400px]"
    :class="{ warning: isWarning, critical: isCritical }"
  >
    <!-- ボーナスリング -->
    <svg v-if="bonusEnabled" class="absolute inset-0 pointer-events-none" viewBox="0 0 400 400">
      <circle cx="200" cy="200" r="185" fill="none" stroke="rgba(255,255,255,0.12)" stroke-width="6" />
      <circle
        cx="200"
        cy="200"
        r="185"
        fill="none"
        stroke="#facc15"
        stroke-width="6"
        stroke-linecap="round"
        :stroke-dasharray="ringCircumference"
        :stroke-dashoffset="ringOffset"
        transform="rotate(-90 200 200)"
        class="transition-[stroke-dashoffset] duration-[600ms] ease-in-out"
      />
    </svg>

    <!-- 爆弾本体 -->
    <div class="bomb-body relative w-[320px] h-[320px] rounded-full flex items-center justify-center">
      <!-- 導火線 -->
      <div class="fuse absolute" style="top: -28px; right: 110px">
        <div class="fuse__spark" :class="{ active: phase === 'running' }" />
      </div>

      <!-- 中央コンテンツ -->
      <div class="flex flex-col items-center gap-2 font-mono">
        <div
          class="text-[3.25rem] font-bold text-slate-100 tracking-wide leading-none"
          :class="{ 'time-pulse': isCritical }"
          style="text-shadow: 0 0 12px rgba(241, 245, 249, 0.4)"
        >
          {{ formattedTime }}
        </div>

        <div class="flex flex-col items-center leading-none">
          <span class="text-[0.6rem] tracking-[0.15em] text-slate-400 uppercase">LIFE</span>
          <span class="text-[1.6rem] font-bold text-slate-200">{{ currentLives }}</span>
        </div>

        <div v-if="optionalValue !== null" class="flex flex-col items-center leading-none">
          <span class="text-[0.6rem] tracking-[0.15em] text-slate-400 uppercase">{{ optionalLabel }}</span>
          <span class="text-[1.6rem] font-bold text-slate-200">{{ optionalValue }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { DeadAirPhase } from '../composables/useDeadAirLogic'

  const props = defineProps<{
    phase: DeadAirPhase
    formattedTime: string
    isWarning: boolean
    isCritical: boolean
    currentLives: number
    bonusEnabled: boolean
    bonusFraction: number
    optionalValue: number | null
    optionalLabel: string
  }>()

  const ringCircumference = computed(() => 2 * Math.PI * 185)
  const ringOffset = computed(() => ringCircumference.value * (1 - props.bonusFraction))
</script>

<style scoped>
  .bomb-body {
    background: radial-gradient(circle at 38% 35%, #4a4a4a, #111 70%);
    box-shadow:
      0 0 0 3px #333,
      0 8px 32px rgba(0, 0, 0, 0.8);
    animation: breathe 2.4s ease-in-out infinite;
  }
  .warning .bomb-body {
    animation: breathe-fast 1.2s ease-in-out infinite;
    box-shadow:
      0 0 0 3px #ef4444,
      0 0 40px rgba(239, 68, 68, 0.4),
      0 8px 32px rgba(0, 0, 0, 0.8);
  }
  .critical .bomb-body {
    animation: shake 0.15s ease-in-out infinite;
    box-shadow:
      0 0 0 3px #ef4444,
      0 0 60px rgba(239, 68, 68, 0.7),
      0 8px 32px rgba(0, 0, 0, 0.8);
  }
  .time-pulse {
    animation: time-pulse 0.5s ease-in-out infinite alternate;
  }

  .fuse {
    width: 4px;
    height: 32px;
    background: repeating-linear-gradient(180deg, #a16207 0px, #a16207 4px, #854d0e 4px, #854d0e 8px);
    border-radius: 2px;
    transform: rotate(20deg);
    transform-origin: bottom center;
  }
  .fuse__spark {
    position: absolute;
    top: -6px;
    left: -3px;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: transparent;
  }
  .fuse__spark.active {
    background: radial-gradient(circle, #fde68a, #f97316);
    box-shadow: 0 0 8px 4px rgba(249, 115, 22, 0.6);
    animation: spark-flicker 0.3s ease-in-out infinite alternate;
  }

  @keyframes breathe {
    0%,
    100% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.025);
    }
  }
  @keyframes breathe-fast {
    0%,
    100% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.04);
    }
  }
  @keyframes shake {
    0%,
    100% {
      transform: translateX(0);
    }
    25% {
      transform: translateX(-3px) rotate(-0.5deg);
    }
    75% {
      transform: translateX(3px) rotate(0.5deg);
    }
  }
  @keyframes spark-flicker {
    from {
      opacity: 0.6;
      transform: scale(0.85);
    }
    to {
      opacity: 1;
      transform: scale(1.15);
    }
  }
  @keyframes time-pulse {
    from {
      color: #f1f5f9;
      text-shadow: 0 0 12px rgba(241, 245, 249, 0.4);
    }
    to {
      color: #ef4444;
      text-shadow: 0 0 20px rgba(239, 68, 68, 0.8);
    }
  }
</style>
