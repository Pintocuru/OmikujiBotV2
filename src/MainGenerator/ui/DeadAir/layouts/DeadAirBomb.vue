<!-- src/MainGenerator/ui/DeadAir/layouts/DeadAirBomb.vue -->
<template>
  <div class="bomb-wrapper" :class="{ warning: isWarning, critical: isCritical }">
    <!-- ボーナスメーター（外周リング） -->
    <svg v-if="bonusEnabled" class="bonus-ring" viewBox="0 0 400 400">
      <circle class="bonus-ring__track" cx="200" cy="200" r="185" fill="none" stroke-width="6" />
      <circle
        class="bonus-ring__fill"
        cx="200"
        cy="200"
        r="185"
        fill="none"
        stroke-width="6"
        :stroke-dasharray="ringCircumference"
        :stroke-dashoffset="ringOffset"
        stroke-linecap="round"
        transform="rotate(-90 200 200)"
      />
    </svg>

    <!-- 爆弾本体 -->
    <div class="bomb-body">
      <!-- 導火線 -->
      <div class="fuse">
        <div class="fuse__spark" :class="{ active: phase === 'running' }" />
      </div>

      <!-- 中央コンテンツ -->
      <div class="bomb-face">
        <!-- 残り時間 -->
        <div class="display display--time" :class="{ pulse: isCritical }">
          {{ formattedTime }}
        </div>

        <!-- ライフ -->
        <div class="display display--lives">
          <span class="display__label">LIFE</span>
          <span class="display__value">{{ currentLives }}</span>
        </div>

        <!-- オプション表示 -->
        <div v-if="optionalValue !== null" class="display display--optional">
          <span class="display__label">{{ optionalLabel }}</span>
          <span class="display__value">{{ optionalValue }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import type { DeadAirPhase } from '../composables/useDeadAirManager'

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
  /* ---- ラッパー ---- */
  .bomb-wrapper {
    position: relative;
    width: 400px;
    height: 400px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  /* ---- ボーナスリング ---- */
  .bonus-ring {
    position: absolute;
    inset: 0;
    pointer-events: none;
  }
  .bonus-ring__track {
    stroke: rgba(255, 255, 255, 0.12);
  }
  .bonus-ring__fill {
    stroke: #facc15; /* yellow-400 */
    transition: stroke-dashoffset 0.6s ease;
  }

  /* ---- 爆弾本体 ---- */
  .bomb-body {
    position: relative;
    width: 320px;
    height: 320px;
    border-radius: 50%;
    background: radial-gradient(circle at 38% 35%, #4a4a4a, #111 70%);
    box-shadow:
      0 0 0 3px #333,
      0 8px 32px rgba(0, 0, 0, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
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

  /* ---- 導火線 ---- */
  .fuse {
    position: absolute;
    top: -28px;
    right: 110px;
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

  /* ---- 中央表示 ---- */
  .bomb-face {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
  }

  .display {
    display: flex;
    flex-direction: column;
    align-items: center;
    line-height: 1;
    color: #e2e8f0;
    font-family: 'Courier New', Courier, monospace;
    letter-spacing: 0.05em;
  }

  .display--time {
    font-size: 3.25rem;
    font-weight: 700;
    color: #f1f5f9;
    text-shadow: 0 0 12px rgba(241, 245, 249, 0.4);
  }

  .display--time.pulse {
    animation: time-pulse 0.5s ease-in-out infinite alternate;
  }

  .display--lives,
  .display--optional {
    font-size: 1rem;
    gap: 2px;
  }

  .display__label {
    font-size: 0.6rem;
    letter-spacing: 0.15em;
    color: #94a3b8;
    text-transform: uppercase;
  }

  .display__value {
    font-size: 1.6rem;
    font-weight: 700;
    color: #e2e8f0;
  }

  /* ---- アニメーション ---- */
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
