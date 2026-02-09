// src\MainGenerator\ui\FlightSeat\useSeatManager.ts
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
  const activeUserIds = ref<Set<string>>(new Set())

  const occupiedSeats = computed(() => seats.value.filter((s) => s !== null).length)

  function addDebugLog(message: string) {
    const timestamp = new Date().toLocaleTimeString('ja-JP', { hour12: false })
    const logEntry = `[${timestamp}] ${message}`
    debugLog.value.push(logEntry)
    if (debugLog.value.length > 50) debugLog.value.shift()
  }

  function initSeatsIfNeeded() {
    if (seats.value.length !== totalSeats.value) {
      seats.value = new Array(totalSeats.value).fill(null)
      activeUserIds.value.clear()
      addDebugLog(`座席を初期化しました (${totalSeats.value}席)`)
    }
  }

  function archiveAndReset() {
    addDebugLog(`!! 満席検知: 履歴保存 (${seatHistory.value.length + 1}回目) !!`)

    if (seatHistory.value.length >= historyLimit.value) {
      seatHistory.value.shift()
    }

    seatHistory.value.push({
      seats: [...seats.value],
      clearedAt: Date.now(),
    })

    seats.value = new Array(totalSeats.value).fill(null)
    activeUserIds.value.clear()

    addDebugLog(`リセット完了。再着席=${allowReseating.value}`)
  }

  function findRandomEmptyIndex(): number {
    const emptyIndexes = seats.value.map((s, i) => (s === null ? i : -1)).filter((i) => i !== -1)

    if (emptyIndexes.length === 0) return -1

    const r = Math.floor(Math.random() * emptyIndexes.length)
    return emptyIndexes[r]
  }

  // ユーザーが既に着席しているかチェック
  function isAlreadySeated(userId: string): boolean {
    return activeUserIds.value.has(userId)
  }

  // ユーザーが過去に着席したことがあるかチェック
  function hasSeatedInHistory(userId: string): boolean {
    return seatHistory.value.some((h) => h.seats.some((s) => s?.userId === userId))
  }

  // ユーザーが着席可能かどうかを判定
  function canUserBeSeat(user: UserVisitRecord): { canSeat: boolean; reason?: string } {
    if (isAlreadySeated(user.userId)) {
      return { canSeat: false, reason: '既に着席中' }
    }

    if (!allowReseating.value && hasSeatedInHistory(user.userId)) {
      addDebugLog(`${user.userName} は過去に着席済み（再着席不可）`)
      return { canSeat: false, reason: '過去に着席済み' }
    }

    return { canSeat: true }
  }

  // ユーザーを指定座席に配置
  function assignToSeat(user: UserVisitRecord, seatIndex: number): void {
    seats.value[seatIndex] = user
    activeUserIds.value.add(user.userId)
    addDebugLog(`${user.userName} が座席 ${seatIndex + 1} に着席`)
  }

  // 満席時の処理とリトライ
  function handleFullSeats(user: UserVisitRecord): boolean {
    addDebugLog(`満席のため ${user.userName} を配置できません`)
    archiveAndReset()

    const retryIndex = seats.value.findIndex((s) => s === null)
    if (retryIndex !== -1) {
      assignToSeat(user, retryIndex)
      addDebugLog(`${user.userName} が座席 ${retryIndex + 1} に着席（リセット後）`)
      return true
    }
    return false
  }

  // ユーザーを座席に登録（メインエントリポイント）
  function registerUser(user: UserVisitRecord): boolean {
    initSeatsIfNeeded()

    // 着席可否チェック
    const { canSeat } = canUserBeSeat(user)
    if (!canSeat) return false

    // 空席検索
    const emptyIndex = findRandomEmptyIndex()

    // 満席の場合
    if (emptyIndex === -1) return handleFullSeats(user)

    // 通常の着席処理
    assignToSeat(user, emptyIndex)
    return true
  }

  return {
    seats,
    seatHistory,
    occupiedSeats,
    debugLog,
    registerUser,
  }
}
