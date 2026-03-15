// src/MainGenerator/ui/LiveClock/composables/useLiveClockTime.ts
import { ref, onMounted, onUnmounted } from 'vue'

const hours = ref('--')
const minutes = ref('--')
const seconds = ref('--')
const colonVisible = ref(true)

let tickTimer: ReturnType<typeof setInterval>
let colonTimer: ReturnType<typeof setInterval>

function updateTime() {
  const now = new Date()
  hours.value = String(now.getHours()).padStart(2, '0')
  minutes.value = String(now.getMinutes()).padStart(2, '0')
  seconds.value = String(now.getSeconds()).padStart(2, '0')
}

export function useLiveClockTime() {
  onMounted(() => {
    updateTime()

    tickTimer = setInterval(updateTime, 1000)

    colonTimer = setInterval(() => {
      colonVisible.value = !colonVisible.value
    }, 500)
  })

  onUnmounted(() => {
    clearInterval(tickTimer)
    clearInterval(colonTimer)
  })

  return {
    hours,
    minutes,
    seconds,
    colonVisible,
  }
}
