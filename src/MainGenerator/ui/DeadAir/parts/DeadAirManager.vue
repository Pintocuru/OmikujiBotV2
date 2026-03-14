<!-- src/MainGenerator/ui/DeadAir/DeadAirManager.vue -->
<template>
  <div class="dead-root" :class="[`bg-${settings.bgColor}`, { 'is-game-over': phase === 'gameOver' }]">
    <!-- 爆弾ウィジェット（右下固定） -->
    <div class="dead-widget">
      <component
        :is="currentLayout"
        :phase="phase"
        :formatted-time="formattedTime"
        :is-warning="isWarning"
        :is-critical="isCritical"
        :current-lives="currentLives"
        :bonus-enabled="settings.bonusEnabled"
        :bonus-fraction="bonusFraction"
        :optional-value="optionalValue"
        :optional-label="optionalLabel"
      />
    </div>

    <!-- オーバーレイ（暗転・ゲームオーバー） -->
    <DeadAirOverlay :life-fraction="lifeFraction" :is-game-over="phase === 'gameOver'" />
  </div>
</template>

<script setup lang="ts">
  import { computed, toRef } from 'vue'
  import { SettingsDeadSchema } from '@/types/OmikujiData/UiSettings/SettingsDeadSchema'
  import type { SettingsDeadType } from '@/types/OmikujiData/UiSettings/SettingsDeadSchema'
  import { useDeadAirManager } from '../composables/useDeadAirManager'
  import { useDeadAirDisplay } from '../composables/useDeadAirDisplay'
  import DeadAirBomb from '../layouts/DeadAirBomb.vue'
  import DeadAirOverlay from './DeadAirOverlay.vue'

  // ---------------------------------------------------------------------------
  // Props
  // ---------------------------------------------------------------------------

  const props = defineProps<{
    settings: SettingsDeadType
    counters: Record<string, number>
  }>()

  // ---------------------------------------------------------------------------
  // 設定の安全なパース
  // ---------------------------------------------------------------------------

  const settings = computed(() => SettingsDeadSchema.parse(props.settings))

  // ---------------------------------------------------------------------------
  // コアロジック
  // ---------------------------------------------------------------------------

  const countersRef = toRef(props, 'counters')

  const { phase, remainSeconds, currentLives, bonusFraction, lifeFraction, optionalValue } = useDeadAirManager(
    settings.value,
    { value: countersRef.value }
  )

  // ---------------------------------------------------------------------------
  // 表示フォーマット
  // ---------------------------------------------------------------------------

  const { formattedTime, isWarning, isCritical } = useDeadAirDisplay({ value: remainSeconds.value })

  // ---------------------------------------------------------------------------
  // レイアウト解決
  // ---------------------------------------------------------------------------

  const layoutMap = {
    bomb: DeadAirBomb,
  } as const

  const currentLayout = computed(() => layoutMap[settings.value.component] ?? DeadAirBomb)

  // ---------------------------------------------------------------------------
  // オプションラベル解決
  // ---------------------------------------------------------------------------

  const optionalLabel = computed(() => settings.value.optionalCounterKey ?? '')
</script>

<style scoped>
  .dead-root {
    position: fixed;
    inset: 0;
    overflow: hidden;
  }

  .dead-root.bg-black {
    background: #000;
  }
  .dead-root.bg-white {
    background: #fff;
  }

  /* OBS ブラウザソース用：右下固定 */
  .dead-widget {
    position: absolute;
    bottom: 16px;
    right: 16px;
  }
</style>
