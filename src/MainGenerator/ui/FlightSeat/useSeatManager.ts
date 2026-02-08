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
  allowReseating: Ref<boolean> // 新規追加: 過去の座席に乗っていたユーザーの再搭乗を許可するか
}

export function useSeatManager(options: SeatManagerOptions) {
  const { totalSeats, historyLimit, allowReseating } = options

  const seats = ref<(UserVisitRecord | null)[]>([])
  const seatHistory = ref<SeatHistory[]>([])
  const userSeatMap = ref<Map<string, number>>(new Map())

  // デバッグ用
  const debugLog = ref<string[]>([])

  // 占有座席数
  const occupiedSeats = computed(() => {
    return seats.value.filter((seat) => seat !== null).length
  })

  // デバッグログを追加
  function addDebugLog(message: string) {
    const timestamp = new Date().toLocaleTimeString('ja-JP')
    debugLog.value.push(`[${timestamp}] ${message}`)
    console.log(`[SeatManager] ${message}`)

    // ログは最新100件まで保持
    if (debugLog.value.length > 100) {
      debugLog.value.shift()
    }
  }

  // 空いている座席のインデックスを取得
  function getAvailableSeats(): number[] {
    return seats.value.map((seat, index) => (seat === null ? index : -1)).filter((index) => index !== -1)
  }

  // ランダムな座席を選択
  function getRandomSeat(availableSeats: number[]): number | null {
    if (availableSeats.length === 0) return null
    const randomIndex = Math.floor(Math.random() * availableSeats.length)
    return availableSeats[randomIndex]
  }

  // 座席配置を更新
  function updateSeats(users: UserVisitRecord[]) {
    addDebugLog(`--- updateSeats 開始: ${users.length}人のユーザー ---`)

    // 履歴に保存済みのユーザーIDを収集
    const historicalUserIds = new Set<string>()
    seatHistory.value.forEach((history) => {
      history.seats.forEach((seat) => {
        if (seat) {
          historicalUserIds.add(seat.userId)
        }
      })
    })

    // 現在の座席にいるユーザーIDを収集
    const currentSeatedUserIds = new Set<string>()
    seats.value.forEach((seat) => {
      if (seat) {
        currentSeatedUserIds.add(seat.userId)
      }
    })

    // 対象ユーザーをフィルタリング
    const eligibleUsers = users.filter((user) => {
      const isInHistory = historicalUserIds.has(user.userId)

      // allowReseating が true の場合、履歴にいても対象とする
      if (allowReseating.value) {
        // 現在座っているユーザーは除外（重複配置を避けるため）
        return true
      } else {
        // allowReseating が false の場合、従来通り履歴にいるユーザーは除外
        if (isInHistory) {
          addDebugLog(`除外（履歴済み）: ${user.userName} (ID: ${user.userId})`)
        }
        return !isInHistory
      }
    })

    const exclusionReason = allowReseating.value ? '再搭乗許可' : `履歴除外: ${historicalUserIds.size}人`
    addDebugLog(`対象ユーザー: ${eligibleUsers.length}人 / 全ユーザー: ${users.length}人 (${exclusionReason})`)

    const currentUsers = new Set(eligibleUsers.map((u) => u.userId))
    addDebugLog(`現在のユーザーID: ${Array.from(currentUsers).join(', ')}`)

    // 座席配列を総座席数に合わせて初期化
    if (seats.value.length !== totalSeats.value) {
      addDebugLog(`座席数変更: ${seats.value.length} → ${totalSeats.value}`)
      seats.value = new Array(totalSeats.value).fill(null)
      userSeatMap.value.clear()
    }

    // 座席の削除処理
    const removedUsers: string[] = []
    userSeatMap.value.forEach((seatIndex, userId) => {
      const userStillPresent = currentUsers.has(userId)

      if (!userStillPresent) {
        // eligibleUsersに含まれていないユーザーは座席から削除
        seats.value[seatIndex] = null
        userSeatMap.value.delete(userId)
        removedUsers.push(userId)
      }
    })
    if (removedUsers.length > 0) {
      addDebugLog(`削除されたユーザー: ${removedUsers.join(', ')}`)
    }

    // 新しいユーザーのみを抽出（既に座っているユーザーを除外）
    const newUsers = eligibleUsers.filter((user) => !userSeatMap.value.has(user.userId))

    if (newUsers.length === 0) {
      addDebugLog('新規ユーザーなし - 処理終了')
      return
    }

    addDebugLog(`新規ユーザー数: ${newUsers.length}人`)

    // 新しいユーザーを配置
    for (const user of newUsers) {
      // 座席が満席かチェック
      if (userSeatMap.value.size >= totalSeats.value) {
        addDebugLog(`座席満席 (${totalSeats.value}席) - 履歴に保存してリセット`)

        // 履歴制限を適用
        if (seatHistory.value.length >= historyLimit.value) {
          seatHistory.value.shift()
          addDebugLog(`履歴上限到達 - 最古の履歴を削除`)
        }

        // 現在の座席状態を履歴に保存
        seatHistory.value.push({
          seats: [...seats.value],
          clearedAt: Date.now(),
        })

        // 座席を完全にクリア
        seats.value = new Array(totalSeats.value).fill(null)
        userSeatMap.value.clear()

        addDebugLog(`座席リセット完了 - 履歴数: ${seatHistory.value.length}`)
      }

      // 空いている座席を探す
      const availableSeats = getAvailableSeats()
      const seatIndex = getRandomSeat(availableSeats)

      // 座席が見つかったら配置
      if (seatIndex !== null) {
        seats.value[seatIndex] = user
        userSeatMap.value.set(user.userId, seatIndex)
        addDebugLog(`配置: ${user.userName} (ID: ${user.userId}) → 座席${seatIndex + 1}`)
      } else {
        addDebugLog(`警告: ${user.userName} を配置できませんでした（空席なし）`)
      }
    }

    addDebugLog(`--- updateSeats 完了: 現在${occupiedSeats.value}/${totalSeats.value}席 ---`)
  }

  // 座席をリセット
  function resetSeats() {
    addDebugLog('座席を手動リセット')
    seats.value = new Array(totalSeats.value).fill(null)
    userSeatMap.value.clear()
  }

  return {
    seats,
    seatHistory,
    occupiedSeats,
    debugLog,
    updateSeats,
    resetSeats,
  }
}
