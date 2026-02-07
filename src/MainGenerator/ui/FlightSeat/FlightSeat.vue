<!-- src\MainGenerator\ui\FlightSeat\FlightSeat.vue -->
<template>
  <div class="p-4 max-w-6xl mx-auto" :data-theme="settings.color">
    <!-- タイトル -->
    <h2 v-if="settings.title" class="text-2xl font-bold text-center mb-6">
      {{ settings.title }}
    </h2>

    <!-- 座席グリッド -->
    <div class="mb-8" :style="gridContainerStyle">
      <div
        v-for="(seat, index) in displaySeats"
        :key="index"
        class="aspect-square border-2 rounded-lg flex items-center justify-center p-2 transition-all duration-300"
        :class="getSeatClass(seat, index)"
        :style="{ gridColumn: getSeatGridColumn(index) }"
      >
        <!-- ユーザーが座っている場合 -->
        <div v-if="seat" class="flex flex-col items-center gap-1 w-full">
          <div class="avatar">
            <div class="w-10 h-10 rounded-full">
              <img v-if="seat.profileImage" :src="seat.profileImage" :alt="seat.userName" />
              <div
                v-else
                class="w-full h-full bg-primary flex items-center justify-center text-primary-content font-bold text-lg"
              >
                {{ seat.userName.charAt(0) }}
              </div>
            </div>
          </div>
          <div class="text-xs text-center truncate w-full px-1">
            {{ seat.userName }}
          </div>
        </div>
        <!-- 空席の場合 -->
        <div v-else class="text-base-300 text-sm">
          {{ index + 1 }}
        </div>
      </div>
    </div>

    <!-- 履歴表示ボタン -->
    <div v-if="seatHistory.length > 0" class="space-y-4">
      <button @click="showHistory = !showHistory" class="btn btn-primary btn-sm">
        <span v-if="!showHistory">過去の座席を見る ({{ seatHistory.length }}回)</span>
        <span v-else>履歴を閉じる</span>
      </button>

      <!-- 履歴リスト -->
      <div v-if="showHistory" class="space-y-4 max-h-96 overflow-y-auto">
        <div v-for="(history, idx) in seatHistory" :key="idx" class="card bg-base-200 shadow-md">
          <div class="card-body p-4">
            <h3 class="card-title text-sm">{{ idx + 1 }}回目 - {{ formatDate(history.clearedAt) }}</h3>
            <div
              class="grid gap-1 mt-2"
              :style="`grid-template-columns: repeat(${Math.min(10, settings.cols || 10)}, minmax(0, 1fr))`"
            >
              <div
                v-for="(seat, seatIdx) in history.seats"
                :key="seatIdx"
                class="badge badge-sm p-2 h-auto"
                :class="seat ? 'badge-success' : 'badge-ghost'"
              >
                <span v-if="seat" class="truncate text-xs">
                  {{ seat.userName }}
                </span>
                <span v-else class="text-base-300">-</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 統計情報 -->
    <div class="stats shadow mt-4 w-full">
      <div class="stat">
        <div class="stat-title">現在の乗車人数</div>
        <div class="stat-value text-primary">{{ occupiedSeats }}</div>
        <div class="stat-desc">/ {{ totalSeats }}席</div>
      </div>
      <div class="stat">
        <div class="stat-title">座席リセット回数</div>
        <div class="stat-value text-secondary">{{ seatHistory.length }}</div>
        <div class="stat-desc">履歴として保存中</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, watch, computed } from 'vue'
  import { storeToRefs } from 'pinia'
  import type { UserVisitRecord } from '@/types/MainGenerator/UserVisits'
  import type { SettingsFlightSeatType } from '@/types/'
  import { useAppStore } from '@main/stores/useAppStore'

  const appStore = useAppStore()
  const { data, botMessages } = storeToRefs(appStore)
  const settings = computed(() => data.value.components.settings.flightSeat)

  interface SeatHistory {
    seats: (UserVisitRecord | null)[]
    clearedAt: number
  }

  const seats = ref<(UserVisitRecord | null)[]>([])
  const seatHistory = ref<SeatHistory[]>([])
  const showHistory = ref(false)
  const userSeatMap = ref<Map<string, number>>(new Map())

  // Store から live コメントユーザーを取得
  const liveCommentUsers = computed(() => {
    return appStore.userVisitManager.getVisitsByRuleId('liveComments')
  })

  // 総座席数を計算
  const totalSeats = computed(() => {
    const { layout, rows, cols } = settings.value

    switch (layout) {
      case 'square':
        return rows * cols

      case 'pyramid':
        // 1 + 2 + 3 + ... + rows
        return (rows * (rows + 1)) / 2

      case 'inversePyramid':
        // rows + (rows-1) + ... + 1
        return (rows * (rows + 1)) / 2

      case 'theater':
        // 中央が最大、両端が最小
        let total = 0
        for (let i = 0; i < rows; i++) {
          const distance = Math.abs(i - Math.floor(rows / 2))
          total += Math.max(2, rows - distance)
        }
        return total

      default:
        return 0
    }
  })

  // 座席配置を計算
  const seatLayout = computed(() => {
    const { layout, rows, cols } = settings.value

    switch (layout) {
      case 'square':
        return Array(rows).fill(cols)

      case 'pyramid':
        return Array.from({ length: rows }, (_, i) => i + 1)

      case 'inversePyramid':
        return Array.from({ length: rows }, (_, i) => rows - i)

      case 'theater':
        return Array.from({ length: rows }, (_, i) => {
          const distance = Math.abs(i - Math.floor(rows / 2))
          return Math.max(2, rows - distance)
        })

      default:
        return []
    }
  })

  // 表示用の座席配列（レイアウトに応じた座席数）
  const displaySeats = computed(() => {
    return seats.value.slice(0, totalSeats.value)
  })

  // グリッドコンテナのスタイル
  const gridContainerStyle = computed(() => {
    const { layout, cols } = settings.value
    const maxCols = layout === 'square' ? cols : Math.max(...seatLayout.value)

    return {
      display: 'grid',
      gridTemplateColumns: `repeat(${maxCols}, minmax(0, 1fr))`,
      gap: '0.75rem',
      justifyItems: 'center',
    }
  })

  // 各座席のグリッド配置を計算
  const getSeatGridColumn = (index: number): string => {
    const { layout, cols } = settings.value

    if (layout === 'square') {
      return 'auto'
    }

    // 現在の座席がどの行に属するか計算
    let currentRow = 0
    let seatCount = 0

    for (let i = 0; i < seatLayout.value.length; i++) {
      if (index < seatCount + seatLayout.value[i]) {
        currentRow = i
        break
      }
      seatCount += seatLayout.value[i]
    }

    const rowSeats = seatLayout.value[currentRow]
    const maxCols = Math.max(...seatLayout.value)
    const offset = Math.floor((maxCols - rowSeats) / 2) + 1
    const positionInRow = index - seatCount

    return `${offset + positionInRow} / span 1`
  }

  // 占有座席数
  const occupiedSeats = computed(() => {
    return displaySeats.value.filter((seat) => seat !== null).length
  })

  /**
   * 座席のクラスを取得
   */
  function getSeatClass(seat: UserVisitRecord | null, index: number): string {
    const baseClass = 'border-base-300'

    if (seat) {
      return `${baseClass} bg-success/10 border-success`
    }

    if (index % 2 === 0) {
      return `${baseClass} bg-info/5`
    }

    return `${baseClass} bg-warning/5`
  }

  /**
   * 空いている座席のインデックスを取得
   */
  function getAvailableSeats(): number[] {
    return displaySeats.value.map((seat, index) => (seat === null ? index : -1)).filter((index) => index !== -1)
  }

  /**
   * ランダムな座席を選択
   */
  function getRandomSeat(availableSeats: number[]): number | null {
    if (availableSeats.length === 0) return null
    const randomIndex = Math.floor(Math.random() * availableSeats.length)
    return availableSeats[randomIndex]
  }

  /**
   * 座席配置を更新
   */
  function updateSeats() {
    const users = liveCommentUsers.value
    const currentUsers = new Set(users.map((u) => u.userId))

    // 座席配列を総座席数に合わせて初期化
    if (seats.value.length !== totalSeats.value) {
      seats.value = new Array(totalSeats.value).fill(null)
      userSeatMap.value.clear()
    }

    // 既存のユーザーで、現在のユーザーリストにいないユーザーの座席をクリア
    userSeatMap.value.forEach((seatIndex, userId) => {
      if (!currentUsers.has(userId)) {
        seats.value[seatIndex] = null
        userSeatMap.value.delete(userId)
      }
    })

    // 新しいユーザーを配置
    for (const user of users) {
      // 既に配置済みのユーザーはスキップ
      if (userSeatMap.value.has(user.userId)) {
        continue
      }

      // 座席が満席の場合、履歴に保存してクリア
      if (userSeatMap.value.size >= totalSeats.value) {
        // 履歴制限を適用
        if (seatHistory.value.length >= settings.value.historyLimit) {
          seatHistory.value.shift()
        }

        seatHistory.value.push({
          seats: [...seats.value],
          clearedAt: Date.now(),
        })
        seats.value = new Array(totalSeats.value).fill(null)
        userSeatMap.value.clear()
      }

      // 空いている座席を探す
      const availableSeats = getAvailableSeats()
      const seatIndex = getRandomSeat(availableSeats)

      // 座席が見つかったら配置
      if (seatIndex !== null) {
        seats.value[seatIndex] = user
        userSeatMap.value.set(user.userId, seatIndex)
      }
    }
  }

  /**
   * 日時フォーマット
   */
  function formatDate(timestamp: number): string {
    const date = new Date(timestamp)
    return date.toLocaleString('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  // ユーザーリストの変更を監視
  watch(liveCommentUsers, updateSeats, { immediate: true, deep: true })

  // 設定変更時に座席をリセット
  watch(
    () => [settings.value.layout, settings.value.rows, settings.value.cols],
    () => {
      seats.value = new Array(totalSeats.value).fill(null)
      userSeatMap.value.clear()
      updateSeats()
    },
    { deep: true }
  )
</script>
