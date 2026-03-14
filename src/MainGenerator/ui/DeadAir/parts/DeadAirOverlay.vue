<!-- src/MainGenerator/ui/DeadAir/parts/DeadAirOverlay.vue -->
<template>
  <!-- 暗転オーバーレイ（ライフ減少に応じて徐々に暗くなる） -->
  <div class="dead-overlay" :style="{ opacity: darknessOpacity }" aria-hidden="true" />

  <!-- ゲームオーバー表示 -->
  <Transition name="gameover">
    <div v-if="isGameOver" class="gameover-screen">
      <p class="gameover-text">GAME OVER</p>
    </div>
  </Transition>
</template>

<script setup lang="ts">
  import { computed } from 'vue'

  const props = defineProps<{
    lifeFraction: number // 0〜1
    isGameOver: boolean
  }>()

  /**
   * 暗転は lifeFraction が 1（満タン）のとき 0、
   * 0（全滅直前）のとき最大 0.72 になる。
   * ゲームオーバー時は 1（完全黒）。
   */
  const darknessOpacity = computed(() => (props.isGameOver ? 1 : (1 - props.lifeFraction) * 0.72))
</script>

<style scoped>
  .dead-overlay {
    position: fixed;
    inset: 0;
    background: #000;
    pointer-events: none;
    transition: opacity 0.8s ease;
    z-index: 10;
  }

  .gameover-screen {
    position: fixed;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 20;
    pointer-events: none;
  }

  .gameover-text {
    font-family: 'Courier New', Courier, monospace;
    font-size: clamp(3rem, 10vw, 6rem);
    font-weight: 900;
    letter-spacing: 0.15em;
    color: #ef4444;
    text-shadow:
      0 0 20px rgba(239, 68, 68, 0.8),
      0 0 60px rgba(239, 68, 68, 0.4);
    animation: gameover-flicker 1.6s ease-in-out infinite alternate;
  }

  /* ---- トランジション ---- */
  .gameover-enter-active {
    animation: gameover-enter 0.6s ease forwards;
  }

  @keyframes gameover-enter {
    from {
      opacity: 0;
      transform: scale(0.7);
      filter: blur(12px);
    }
    to {
      opacity: 1;
      transform: scale(1);
      filter: blur(0);
    }
  }

  @keyframes gameover-flicker {
    0% {
      opacity: 1;
    }
    80% {
      opacity: 1;
    }
    85% {
      opacity: 0.4;
    }
    90% {
      opacity: 1;
    }
    95% {
      opacity: 0.6;
    }
    100% {
      opacity: 1;
    }
  }
</style>
