<template>
  <div class="p-2">
    <div
      class="relative rounded-3xl border-4 p-2 overflow-hidden transition-colors duration-500"
      :class="[`bg-${color.backFrom}`, `border-${color.backTo}`, `text-${color.backFrom}-content`]"
    >
      <div class="flex items-center justify-center gap-2">
        <div class="h-0.5 w-8 bg-gradient-to-r from-transparent" :class="[`to-${color.backFrom}-content`]"></div>
        <span class="font-black tracking-[0.2em] text-sm drop-shadow-sm"> STREAM POWER </span>
        <div class="h-0.5 w-8 bg-gradient-to-l from-transparent" :class="[`to-${color.backFrom}-content`]"></div>
      </div>

      <div class="flex items-center justify-center">
        <div v-for="(digit, i) in digits" :key="i" class="relative w-10 h-16 overflow-hidden flex-shrink-0">
          <div class="digit-reel absolute inset-x-0" :style="{ transform: `translateY(-${digit * 64}px)` }">
            <div v-for="n in 10" :key="n" class="flex items-center justify-center w-full h-16 text-5xl font-black">
              {{ n - 1 }}
            </div>
          </div>
        </div>
      </div>

      <div class="grid gap-2 justify-center" style="grid-template-columns: repeat(auto-fill, 80px)">
        <div v-for="user in users" :key="`${user.userId}-${user.timestamp}`" class="seat-container">
          <Cell :seat="user" :size="size" :index="0" :sortKey="sortKey" />
        </div>
      </div>

      <div
        class="absolute inset-0 -z-10 opacity-20 pointer-events-none"
        :class="[`bg-gradient-to-br from-${color.backFrom} to-${color.backTo}`]"
      ></div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { UserStatsRecord, SocialSortKey } from '@/types'
  import { DaisyUiThemeFieldsType } from '@shared/styles/DaisyUiTheme'
  import Cell from './Cell.vue'

  const props = defineProps<{
    size: number
    users: UserStatsRecord[]
    sortKey: SocialSortKey | null
    color: DaisyUiThemeFieldsType
    streamScore: number
  }>()

  const digits = computed(() => {
    const str = Math.floor(props.streamScore).toString()
    // 最小6桁、スコアが増えれば自動で伸びる
    return str.padStart(Math.max(6, str.length), '0').split('').map(Number)
  })
</script>

<style scoped>
  /* 数字が入れ替わるときの派手なバウンドアニメーション */
  .digit-reel {
    transition: transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  /* ユニット登場アニメーション */
  @keyframes unit-appear {
    0% {
      transform: scale(0) rotate(-15deg);
      opacity: 0;
    }
    70% {
      transform: scale(1.1) rotate(5deg);
      opacity: 1;
    }
    100% {
      transform: scale(1) rotate(0deg);
    }
  }

  .seat-container {
    animation: unit-appear 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) backwards;
  }

  /* 各ユニットの出現にディレイをかける */
  .seat-container:nth-child(n) {
    animation-delay: calc(var(--index, 0) * 0.03s);
  }
</style>
