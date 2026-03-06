// src/MainGenerator/ui/FlightSeat/useSeatManager.ts
import { ref, computed, type Ref } from 'vue'
import { UserNameType } from '@shared/types'
import { UserStatsRecord } from '@/types'
import { useAppStore } from '@/MainGenerator/stores/useAppStore'

interface SeatHistory {
  seats: (UserStatsRecord | null)[]
  clearedAt: number
}

interface SeatManagerOptions {
  totalSeats: Ref<number>
  isRandomReplacement: Ref<boolean>
}

const HISTORY_LIMIT = 10

export function useSeatManager(options: SeatManagerOptions) {
  const appStore = useAppStore()
  const { totalSeats, isRandomReplacement } = options

  const seats = ref<(UserStatsRecord | null)[]>([])
  const seatHistory = ref<SeatHistory[]>([])
  const debugLog = ref<string[]>([])
  const activeUserIds = ref<Set<string>>(new Set())

  const occupiedSeats = computed(() => seats.value.filter((s) => s !== null).length)

  function addDebugLog(message: string) {
    const timestamp = new Date().toLocaleTimeString('ja-JP', { hour12: false })
    debugLog.value.push(`[${timestamp}] ${message}`)
    if (debugLog.value.length > 50) debugLog.value.shift()
  }

  function initSeatsIfNeeded() {
    if (seats.value.length !== totalSeats.value) {
      seats.value = new Array(totalSeats.value).fill(null)
      activeUserIds.value.clear()
      addDebugLog(`座席を初期化しました (${totalSeats.value}席)`)
    }
  }

  // ボタン押下時に履歴を保存してリセット（外部公開）
  function saveHistoryAndReset() {
    addDebugLog(`履歴保存 (${seatHistory.value.length + 1}回目)`)

    if (seatHistory.value.length >= HISTORY_LIMIT) {
      seatHistory.value.shift()
    }

    seatHistory.value.push({
      seats: [...seats.value],
      clearedAt: Date.now(),
    })

    seats.value = new Array(totalSeats.value).fill(null)
    activeUserIds.value.clear()

    addDebugLog('リセット完了')
  }

  function findRandomEmptyIndex(): number {
    const emptyIndexes = seats.value.map((s, i) => (s === null ? i : -1)).filter((i) => i !== -1)
    if (emptyIndexes.length === 0) return -1
    return emptyIndexes[Math.floor(Math.random() * emptyIndexes.length)]
  }

  function isAlreadySeated(userId: string): boolean {
    return activeUserIds.value.has(userId)
  }

  function assignToSeat(user: UserNameType, seatIndex: number): void {
    const userData = appStore.userSession.stats.get(user.userId)
    if (!userData) return
    seats.value[seatIndex] = userData
    activeUserIds.value.add(user.userId)
    addDebugLog(`${user.userName} が座席 ${seatIndex + 1} に着席`)
  }

  // 満席時の処理: isRandomReplacement=true ならランダムに誰かを降ろす
  function handleFullSeats(user: UserNameType): boolean {
    if (!isRandomReplacement.value) {
      addDebugLog(`満席のため ${user.userName} を配置できません（置き換えなし）`)
      return false
    }

    // ランダムに占有座席を選んで降ろす
    const occupiedIndexes = seats.value.map((s, i) => (s !== null ? i : -1)).filter((i) => i !== -1)
    const targetIndex = occupiedIndexes[Math.floor(Math.random() * occupiedIndexes.length)]
    const evicted = seats.value[targetIndex]

    activeUserIds.value.delete(evicted!.userId)
    addDebugLog(`${evicted!.userName} が座席 ${targetIndex + 1} から降ろされました`)

    assignToSeat(user, targetIndex)
    return true
  }

  function registerUser(user: UserNameType): boolean {
    initSeatsIfNeeded()

    // 既に着席中なら無視
    if (isAlreadySeated(user.userId)) {
      addDebugLog(`${user.userName} は既に着席中`)
      return false
    }

    // 空席があれば着席（再着席は常に許可）
    const emptyIndex = findRandomEmptyIndex()
    if (emptyIndex !== -1) {
      assignToSeat(user, emptyIndex)
      return true
    }

    // 満席の場合
    return handleFullSeats(user)
  }

  return {
    seats,
    seatHistory,
    occupiedSeats,
    debugLog,
    registerUser,
    saveHistoryAndReset,
  }
}
