<!-- src/MainGenerator/ui/FlightSeat/parts/SeatCell.vue -->
<template>
  <!-- ユーザーが座っている場合 -->
  <div v-if="seat" class="relative flex items-center justify-center seat-pop">
    <div class="avatar">
      <div
        class="rounded-full overflow-hidden"
        :class="[
          seat.isSyoken ? 'ring-3 ring-warning ring-offset-6 ring-offset-base-100' : '',
          seat.team ? `border-3 border-${seat.team}` : '',
        ]"
        :style="{ width: cellSize + 'px', height: cellSize + 'px' }"
      >
        <img v-if="seat.profileImage" :src="seat.profileImage" :alt="seat.userName" />
        <div
          v-else
          class="w-full h-full bg-primary flex items-center justify-center text-primary-content font-bold text-2xl"
        >
          {{ seat.userName.charAt(0) }}
        </div>
      </div>
    </div>

    <!-- tc (個人コメント数) -->
    <div
      v-if="statKey && statClassMap[statKey] && seat[statKey]"
      class="absolute bottom-0 right-0 text-white font-bold seat-text-stroke"
      :class="statClassMap[statKey]"
    >
      {{ seat[statKey] }}
    </div>
  </div>

  <!-- 空席の場合 -->
  <div
    v-else
    class="rounded-lg flex items-center justify-center transition-all duration-300"
    :class="seatColorClass"
    :style="seatGradientStyle"
  >
    <div
      class="relative flex items-center justify-center text-3xl font-bold"
      :style="{ width: cellSize + 'px', height: cellSize + 'px' }"
    >
      <!-- 表示番号: 呼び出し元から seatNumber を受け取る。未指定時は index + 1 -->
      {{ seatNumber ?? index + 1 }}
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { UserStatsRecord, StatKeyNum } from '@/types'
  import { DaisyUIColorType } from '@shared/styles/DaisyUiTheme'

  const props = defineProps<{
    seat: UserStatsRecord | null
    index: number
    statKey: StatKeyNum | null
    size?: number
    colorReverse?: boolean
    colorFrom?: DaisyUIColorType // 空席セルのベースカラー
    colorTo?: DaisyUIColorType // 指定するとグラデーションになる
    /**
     * 表示する座席番号。
     * 省略時は index + 1 を使う（従来互換）。
     * bingo の FREE スキップなど、index と表示番号がズレる場合に使う。
     */
    seatNumber?: number
  }>()

  const cellSize = computed(() => props.size ?? 80)

  // ---- カラー計算 -------------------------------------------------------

  /** グラデーションなし（単色）のとき使う Tailwind クラス */
  const seatColorClass = computed(() => {
    if (props.colorTo) {
      // グラデーション時はインラインスタイルで塗るのでクラスは不要
      return 'text-base-content'
    }
    const c = props.colorFrom ?? 'info'
    return props.colorReverse ? `bg-${c}-content text-${c}` : `bg-${c} text-${c}-content`
  })

  /**
   * グラデーション用インラインスタイル。
   * colorTo がある場合のみ CSS カスタムプロパティを参照して linear-gradient を生成する。
   *
   * DaisyUI の色は CSS 変数 --color-{name} (oklch) で定義されている。
   * 例: var(--color-primary) / var(--color-secondary)
   */
  const seatGradientStyle = computed(() => {
    if (!props.colorTo) return {}
    const from = props.colorFrom ?? 'info'
    const to = props.colorTo
    return {
      background: `linear-gradient(135deg, oklch(var(--${from})), oklch(var(--${to})))`,
    }
  })

  // ---- stat 表示 --------------------------------------------------------

  const statClassMap: Record<StatKeyNum, string> = {
    userName: 'text-xs',
    tc: 'text-xl',
    giftPrice: 'text-xl',
  }
</script>

<style scoped>
  .seat-text-stroke {
    color: white;
    text-shadow:
      -1px -1px 0 #000,
      1px -1px 0 #000,
      -1px 1px 0 #000,
      1px 1px 0 #000;
  }

  @keyframes seat-pop {
    0% {
      transform: scale(0.5);
    }
    40% {
      transform: scale(1.3);
    }
    70% {
      transform: scale(0.9);
    }
    100% {
      transform: scale(1);
    }
  }

  .seat-pop {
    animation: seat-pop 0.45s cubic-bezier(0.34, 1.56, 0.64, 1);
  }
</style>
