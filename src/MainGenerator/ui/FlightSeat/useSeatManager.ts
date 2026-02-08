import { ref, computed, type Ref } from 'vue'
import type { UserVisitRecord } from '@/types/MainGenerator/UserVisits'

interface SeatHistory {
  seats: (UserVisitRecord | null)[]
  clearedAt: number
}

interface SeatManagerOptions {
  totalSeats: Ref<number>
  historyLimit: Ref<number>
  allowReseating: Ref<boolean>
}

export function useSeatManager(options: SeatManagerOptions) {
  const { totalSeats, historyLimit, allowReseating } = options

  const seats = ref<(UserVisitRecord | null)[]>([])
  const seatHistory = ref<SeatHistory[]>([])
  const debugLog = ref<string[]>([])
  
  // イベント駆動型の核心：現在座席にいるユーザーのIDセット
  const activeUserIds = ref<Set<string>>(new Set())

  const occupiedSeats = computed(() => seats.value.filter(s => s !== null).length)
  const pendingCount = computed(() => 0)

  function addDebugLog(message: string) {
    const timestamp = new Date().toLocaleTimeString('ja-JP', { hour12: false })
    const logEntry = `[${timestamp}] ${message}`
    debugLog.value.push(logEntry)
    if (debugLog.value.length > 50) debugLog.value.shift()
  }

  // 座席初期化
  function initSeatsIfNeeded() {
    if (seats.value.length !== totalSeats.value) {
      seats.value = new Array(totalSeats.value).fill(null)
      activeUserIds.value.clear()
      addDebugLog(`座席を初期化しました (${totalSeats.value}席)`)
    }
  }

  // 履歴への保存とリセット
  function archiveAndReset() {
    addDebugLog(`!! 満席検知: 履歴保存 (${seatHistory.value.length + 1}回目) !!`)

    if (seatHistory.value.length >= historyLimit.value) {
      seatHistory.value.shift()
    }
    
    seatHistory.value.push({
      seats: [...seats.value],
      clearedAt: Date.now()
    })

    // 座席とアクティブIDをクリア（再着席を可能にする）
    seats.value = new Array(totalSeats.value).fill(null)
    activeUserIds.value.clear()

    addDebugLog(`リセット完了。再着席=${allowReseating.value}`)
  }

  // 【核心機能】特定ユーザーを座らせる（イベント駆動のエントリポイント）
  function registerUser(user: UserVisitRecord): boolean {
    initSeatsIfNeeded()

    // 既に座っている場合はスキップ
    if (activeUserIds.value.has(user.userId)) {
      return false
    }

    // allowReseating=false の場合、履歴チェック
    if (!allowReseating.value) {
      const hasBeenSeated = seatHistory.value.some(h =>
        h.seats.some(s => s?.userId === user.userId)
      )
      if (hasBeenSeated) {
        addDebugLog(`${user.userName} は過去に着席済み（再着席不可）`)
        return false
      }
    }

    // 空席を探す
    const emptyIndex = seats.value.findIndex(s => s === null)
    
    if (emptyIndex === -1) {
      // 満席の場合
      addDebugLog(`満席のため ${user.userName} を配置できません`)
      archiveAndReset()
      
      // リセット後に再試行
      const retryIndex = seats.value.findIndex(s => s === null)
      if (retryIndex !== -1) {
        seats.value[retryIndex] = user
        activeUserIds.value.add(user.userId)
        addDebugLog(`${user.userName} が座席 ${retryIndex + 1} に着席（リセット後）`)
        return true
      }
      return false
    }

    // 着席
    seats.value[emptyIndex] = user
    activeUserIds.value.add(user.userId)
    addDebugLog(`${user.userName} が座席 ${emptyIndex + 1} に着席`)
    return true
  }

  // 【イベントリスナー対応】コメントイベントを直接処理
  function handleVisitEvent(record: UserVisitRecord) {
    registerUser(record)
  }

  return {
    seats,
    seatHistory,
    occupiedSeats,
    pendingCount,
    debugLog,
    handleVisitEvent, // イベントリスナー用のメソッド
  }
}