<!-- src/MainGenerator/ui/SocialRoster/layouts/StreamPower.vue -->
<template>
  <div
    class="relative rounded-3xl border-4 p-2 overflow-hidden transition-colors duration-500"
    :class="[`bg-${color.backFrom}`, `border-${color.backTo}`, `text-${color.backFrom}-content`]"
  >
    <!-- タイトル -->
    <div class="flex items-center justify-center gap-2">
      <div class="h-0.5 w-8 bg-gradient-to-r from-transparent" :class="[`to-${color.backFrom}-content`]"></div>
      <span class="font-black tracking-[0.2em] text-sm drop-shadow-sm"> STREAM POWER </span>
      <div class="h-0.5 w-8 bg-gradient-to-l from-transparent" :class="[`to-${color.backFrom}-content`]"></div>
    </div>

    <!-- 配信戦闘力 + counts -->
    <div class="flex items-center justify-center gap-6">
      <!-- 初見数 -->
      <div class="flex flex-col items-center leading-none">
        <Sprout class="w-4 h-4 mb-0.5" />
        <span class="text-xl font-bold">{{ counts.syokenCount }}</span>
      </div>

      <!-- 区切り線 -->
      <div class="h-10 w-px opacity-30" :class="[`bg-${color.backFrom}-content`]"></div>

      <!-- 配信戦闘力 -->
      <div class="flex items-center justify-center">
        <div v-for="(digit, i) in digits" :key="i" class="relative w-10 h-16 overflow-hidden flex-shrink-0">
          <div class="digit-reel absolute inset-x-0" :style="{ transform: `translateY(-${digit * 64}px)` }">
            <div v-for="n in 10" :key="n" class="flex items-center justify-center w-full h-16 text-5xl font-black">
              {{ n - 1 }}
            </div>
          </div>
        </div>
      </div>

      <!-- 区切り線 -->
      <div class="h-10 w-px opacity-30" :class="[`bg-${color.backFrom}-content`]"></div>

      <!-- ユーザー数 -->
      <div class="flex flex-col items-center leading-none">
        <Users class="w-4 h-4 mb-0.5" />
        <span class="text-xl font-bold">{{ counts.userCount }}</span>
      </div>
    </div>

    <!-- ユーザーリスト -->
    <grid
      :users="users"
      :sortKey="sortKey"
      :color="color"
      :counts="counts"
      :size="size"
      :maxRows="maxRows"
      :maxColumns="maxColumns"
    />
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { UserStatsRecord, SocialSortKey, SocialRosterCounts } from '@/types'
  import grid from './Grid.vue'
  import { DaisyUiThemeFieldsType } from '@shared/styles/DaisyUiTheme'
  import { Sprout, Users } from 'lucide-vue-next'

  const props = defineProps<{
    size: number
    users: UserStatsRecord[]
    sortKey: SocialSortKey
    color: DaisyUiThemeFieldsType
    counts: SocialRosterCounts
    maxRows: number | null
    maxColumns: number | null
  }>()

  const digits = computed(() => {
    const str = Math.floor(props.counts.streamScore).toString()
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
