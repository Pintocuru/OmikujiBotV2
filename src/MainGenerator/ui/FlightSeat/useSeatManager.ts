import { ref, computed, type Ref, nextTick } from 'vue'
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
  const userSeatMap = ref<Map<string, number>>(new Map())
  const debugLog = ref<string[]>([])
  
  // 満席時に溢れたユーザーを保持する待機列
  const pendingUsers = ref<UserVisitRecord[]>([])
  
  // ★重要：一度でも座席に配置された（または待機列に入った）ユーザーIDの記録
  // これにより、リセット後に同じユーザーリストが来ても「新規」と誤認しなくなります
  const processedUserIds = ref<Set<string>>(new Set())
  
  // 循環防止用のフラグ
  const isProcessing = ref(false)

  const occupiedSeats = computed(() => seats.value.filter(s => s !== null).length)
  const pendingCount = computed(() => pendingUsers.value.length)

  function addDebugLog(message: string) {
    const timestamp = new Date().toLocaleTimeString('ja-JP', { hour12: false });
    const logEntry = `[${timestamp}] ${message}`;
    debugLog.value.push(logEntry);
    if (debugLog.value.length > 50) debugLog.value.shift();
  }

  // 座席初期化
  function initSeatsIfNeeded() {
    if (seats.value.length !== totalSeats.value) {
      seats.value = new Array(totalSeats.value).fill(null)
      userSeatMap.value.clear()
      addDebugLog(`座席を初期化しました (${totalSeats.value}席)`)
    }
  }

  // 履歴への保存（非同期）
  async function archiveAndReset() {
    if (isProcessing.value) return
    isProcessing.value = true

    addDebugLog(`!! 満席検知: 履歴保存 (${seatHistory.value.length + 1}回目) !!`)

    // 1. 履歴に追加
    if (seatHistory.value.length >= historyLimit.value) {
      seatHistory.value.shift()
    }
    seatHistory.value.push({
      seats: [...seats.value],
      clearedAt: Date.now()
    })

    // 2. 現在の座席のみクリア（processedUserIds は維持！）
    seats.value = new Array(totalSeats.value).fill(null)
    userSeatMap.value.clear()

    // 3. 次の tick で待機列を処理
    await nextTick()
    
    addDebugLog(`リセット完了。待機中の${pendingUsers.value.length}人を配置します。`)
    isProcessing.value = false
    
    // 待機列がある場合は再配置をキック
    if (pendingUsers.value.length > 0) {
      processQueue()
    }
  }

  // 待機列から座席へ配置するロジック
  function processQueue() {
    if (isProcessing.value) return
    
    initSeatsIfNeeded()

    // 待機列から現在の空き容量分だけ取り出す
    while (pendingUsers.value.length > 0) {
      if (userSeatMap.value.size >= totalSeats.value) {
        archiveAndReset()
        return
      }

      const user = pendingUsers.value.shift()
      if (!user) continue

      const availableIndices = seats.value
        .map((s, i) => (s === null ? i : -1))
        .filter(i => i !== -1)

      if (availableIndices.length > 0) {
        const targetIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)]
        seats.value[targetIndex] = user
        userSeatMap.value.set(user.userId, targetIndex)
      }
    }
  }

  // 外部からの更新エントリポイント
  function updateSeats(allUsers: UserVisitRecord[]) {
    // 1. 履歴済みチェック (allowReseating: false の場合のみ)
    let filtered = allUsers
    if (!allowReseating.value) {
      const historyIds = new Set(
        seatHistory.value.flatMap(h => h.seats.filter(s => s !== null).map(s => s!.userId))
      )
      filtered = allUsers.filter(u => !historyIds.has(u.userId))
    }

    // 2. 「まだ一度も座っていない」かつ「待機列にもいない」本当の新規ユーザーのみ抽出
    const newArrivals = filtered.filter(u => !processedUserIds.value.has(u.userId))

    // 3. いなくなった人を管理（座席にいる人のみ）
    const activeIds = new Set(filtered.map(u => u.userId))
    userSeatMap.value.forEach((index, userId) => {
      if (!activeIds.has(userId)) {
        seats.value[index] = null
        userSeatMap.value.delete(userId)
        // 座席から離れたら「処理済み」からも外す（再度座れるようにする）
        processedUserIds.value.delete(userId)
      }
    })

    // 4. 新規ユーザーを処理済みリストと待機列に追加
    if (newArrivals.length > 0) {
      newArrivals.forEach(u => processedUserIds.value.add(u.userId))
      pendingUsers.value.push(...newArrivals)
      addDebugLog(`${newArrivals.length}人が新規到着（累計処理済み: ${processedUserIds.value.size}人）`)
      
      // 5. 配置実行
      processQueue()
    }
  }

  return {
    seats,
    seatHistory,
    occupiedSeats,
    pendingCount,
    debugLog,
    updateSeats
  }
}