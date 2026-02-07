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
}

export function useSeatManager(options: SeatManagerOptions) {
  const { totalSeats, historyLimit } = options

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
    return seats.value
      .map((seat, index) => (seat === null ? index : -1))
      .filter((index) => index !== -1)
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
    
    // 履歴にも現在の座席にも含まれていないユーザーのみを対象とする
    const eligibleUsers = users.filter((user) => {
      const isInHistory = historicalUserIds.has(user.userId)
      const isCurrentlySeated = currentSeatedUserIds.has(user.userId)
      
      if (isInHistory) {
        addDebugLog(`除外（履歴済み）: ${user.userName} (ID: ${user.userId})`)
      }
      
      return !isInHistory
    })
    
    addDebugLog(`対象ユーザー: ${eligibleUsers.length}人 / 全ユーザー: ${users.length}人 (履歴除外: ${historicalUserIds.size}人)`)
    
    const currentUsers = new Set(eligibleUsers.map((u) => u.userId))
    addDebugLog(`現在のユーザーID: ${Array.from(currentUsers).join(', ')}`)

    // 座席配列を総座席数に合わせて初期化
    if (seats.value.length !== totalSeats.value) {
      addDebugLog(`座席数変更: ${seats.value.length} → ${totalSeats.value}`)
      seats.value = new Array(totalSeats.value).fill(null)
      userSeatMap.value.clear()
    }

    // 【重要】座席に座っているユーザーは削除しない
    // eligibleUsersに含まれないユーザーでも、現在座っている場合は維持する
    // （削除されるのは履歴に入ったユーザーのみ）
    const removedUsers: string[] = []
    userSeatMap.value.forEach((seatIndex, userId) => {
      const isInHistory = historicalUserIds.has(userId)
      if (isInHistory) {
        seats.value[seatIndex] = null
        userSeatMap.value.delete(userId)
        removedUsers.push(userId)
      }
    })
    if (removedUsers.length > 0) {
      addDebugLog(`削除されたユーザー（履歴済み）: ${removedUsers.join(', ')}`)
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