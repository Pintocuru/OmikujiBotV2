// src/MainGenerator/ui/LiveClock/composables/useLiveClockTime.ts
import { ref, onMounted, onUnmounted } from 'vue'

const hours = ref('--')
const minutes = ref('--')
const seconds = ref('--')
const year = ref('--')
const month = ref('--')
const date = ref('--')
const day = ref('')
const colonVisible = ref(true)

let tickTimer: ReturnType<typeof setInterval>
let colonTimer: ReturnType<typeof setInterval>

// 将来的にストアから切り替えられるよう、マップ形式で保持
const dayNamesMap = {
  ja: ['日', '月', '火', '水', '木', '金', '土'],
  en: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  ko: ['일', '월', '화', '수', '목', '금', '토'], // 韓国語
  zh: ['週日', '週一', '週二', '週三', '週四', '週五', '週六'], // 台湾（繁体字）
}

function updateTime() {
  const now = new Date()

  // 時刻
  hours.value = String(now.getHours()).padStart(2, '0')
  minutes.value = String(now.getMinutes()).padStart(2, '0')
  seconds.value = String(now.getSeconds()).padStart(2, '0')

  // 日付
  year.value = String(now.getFullYear())
  month.value = String(now.getMonth() + 1)
  date.value = String(now.getDate())

  // 現時点では固定で 'ja' を参照。後でここをストアの値等で動的にする
  const currentLang = 'ja'
  day.value = dayNamesMap[currentLang][now.getDay()]
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
    year,
    month,
    date,
    day,
    colonVisible,
  }
}
