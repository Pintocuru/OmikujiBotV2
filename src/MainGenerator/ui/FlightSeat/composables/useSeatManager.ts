// src/MainGenerator/ui/FlightSeat/composables/useSeatManager.ts
import { ref, computed, type Ref } from 'vue'
import { UserNameType } from '@shared/types'
import { UserStatsRecord } from '@/types'

/**
 * ユーザーIDからUserStatsRecordを解決する関数の型。
 * ジェネレーターではappStoreから、プレビューではダミー生成関数を渡す。
 */
export type UserStatsResolver = (userId: string) => UserStatsRecord | null | undefined

export function useSeatManager(totalSeats: Ref<number>, resolveUser: UserStatsResolver) {
  const seats = ref<(UserStatsRecord | null)[]>([])
  const debugLog = ref<string[]>([])
  const activeUserIds = ref<Map<string, number>>(new Map()) // userId -> seatIndex

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

  function resetSeats() {
    seats.value = new Array(totalSeats.value).fill(null)
    activeUserIds.value.clear()
    addDebugLog(`座席をリセットしました (${totalSeats.value}席)`)
  }

  function findRandomEmptyIndex(): number {
    const emptyIndexes = seats.value.map((s, i) => (s === null ? i : -1)).filter((i) => i !== -1)
    if (emptyIndexes.length === 0) return -1
    return emptyIndexes[Math.floor(Math.random() * emptyIndexes.length)]
  }

  function assignToSeat(user: UserNameType, seatIndex: number): void {
    const userData = resolveUser(user.userId)
    if (!userData) return
    seats.value[seatIndex] = userData
    activeUserIds.value.set(user.userId, seatIndex)
    addDebugLog(`${user.userName} が座席 ${seatIndex + 1} に着席`)
  }

  function handleFullSeats(user: UserNameType): boolean {
    // lastVisit が最も古い座席を探す
    let oldestIndex = -1
    let oldestVisit = Infinity

    seats.value.forEach((s, i) => {
      if (s !== null && s.lastVisit < oldestVisit) {
        oldestVisit = s.lastVisit
        oldestIndex = i
      }
    })

    if (oldestIndex === -1) return false

    const evicted = seats.value[oldestIndex]
    activeUserIds.value.delete(evicted!.userId)
    addDebugLog(`${evicted!.userName} が座席 ${oldestIndex + 1} から降ろされました（最古）`)

    assignToSeat(user, oldestIndex)
    return true
  }

  function registerUser(user: UserNameType): boolean {
    initSeatsIfNeeded()

    // 既に着席中なら同じ席のデータを更新
    if (activeUserIds.value.has(user.userId)) {
      const seatIndex = activeUserIds.value.get(user.userId)!
      const userData = resolveUser(user.userId)
      if (!userData) return false
      seats.value[seatIndex] = userData
      addDebugLog(`${user.userName} の座席 ${seatIndex + 1} データを更新`)
      return true
    }

    // 空席があれば着席
    const emptyIndex = findRandomEmptyIndex()
    if (emptyIndex !== -1) {
      assignToSeat(user, emptyIndex)
      return true
    }

    // 満席の場合は最古ユーザーを置き換え
    return handleFullSeats(user)
  }

  return {
    seats,
    occupiedSeats,
    debugLog,
    registerUser,
    resetSeats,
  }
}
