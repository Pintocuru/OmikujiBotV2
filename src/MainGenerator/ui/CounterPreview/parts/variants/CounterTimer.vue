<!-- src/MainGenerator/ui/CounterPreview/parts/variants/CounterTimer.vue -->
<template>
  <CounterCardBase :counter-setting="counterSetting" :is-bouncing="isBouncing">
    <div class="drop-shadow-md" @click="stopTimer">
      <div v-if="counterSetting.label !== ''" class="text-xl">
        {{ counterSetting.label }}
      </div>

      <div class="text-5xl font-black">{{ formatElapsed(elapsed) }}</div>
    </div>

    <ul v-if="displayedUsers.length > 0" class="flex flex-wrap gap-2 justify-center">
      <li
        v-for="(value, index) in displayedUsers"
        :key="value.userId + '-' + index"
        class="badge badge-warning text-sm"
      >
        <div v-if="value.profileImage !== ''" class="avatar">
          <div class="w-5 rounded-full">
            <img :src="value.profileImage" alt="" />
          </div>
        </div>
        <div v-else class="avatar placeholder">
          <div class="bg-neutral text-neutral-content w-5 rounded-full flex items-center justify-center">
            {{ (value.userName || 'A').charAt(0) }}
          </div>
        </div>
        {{ value.userName }}
      </li>
    </ul>
  </CounterCardBase>
</template>

<script setup lang="ts">
  import { ref, watch, onMounted, onBeforeUnmount } from 'vue'
  import { SettingsCounterType } from '@/types/'
  import { UserVisitRecord } from '@/types/MainGenerator/UserVisits'
  import { useCounterDisplay } from '../base/useCounterDisplay'
  import CounterCardBase from '../base/CounterCardBase.vue'

  const props = defineProps<{
    counterSetting: SettingsCounterType
    count: number | null
    users: UserVisitRecord[]
  }>()

  const { isBouncing, displayCount, displayedUsers } = useCounterDisplay(props, {
    showCounter: true,
    limitUserCount: 1,
  })

  // ローカル経過時間
  const elapsed = ref(0)
  let timer: number | null = null

  // 経過時間フォーマット
  const formatElapsed = (sec: number) => {
    const m = Math.floor(sec / 60)
    const s = sec % 60
    return `${m}:${s.toString().padStart(2, '0')}`
  }

  // displayCount が変わったらリセット
  watch(
    () => displayCount.value,
    (newVal, oldVal) => {
      if (newVal === 0) {
        // 停止
        elapsed.value = 0
        stopTimer()
        return
      }

      // 値が変わったらリセット
      elapsed.value = 0
      startTimer()
    }
  )

  // タイマー制御
  const startTimer = () => {
    stopTimer()
    timer = window.setInterval(() => {
      elapsed.value++
    }, 1000)
  }

  const stopTimer = () => {
    if (timer !== null) {
      clearInterval(timer)
      timer = null
      elapsed.value = 0
    }
  }

  onBeforeUnmount(() => stopTimer())
</script>
