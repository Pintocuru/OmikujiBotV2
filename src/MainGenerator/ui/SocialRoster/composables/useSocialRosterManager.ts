// src/MainGenerator/ui/SocialRoster/composables/useSocialRosterManager.ts
import { ref, computed, type Ref } from 'vue'
import { UserNameType } from '@shared/types'
import { UserStatsRecord } from '@/types'
import { useAppStore } from '@main/stores/useAppStore'
import { SocialSortKey } from '@/types'

interface SocialRosterManagerOptions {
  sortKey: Ref<SocialSortKey>
}

export function useSocialRosterManager(options: SocialRosterManagerOptions) {
  const appStore = useAppStore()
  const { sortKey } = options

  // userId → UserStatsRecord のMap（全員保持）
  const userMap = ref<Map<string, UserStatsRecord>>(new Map())

  // 配信戦闘力
  const streamScore = computed(() => {
    const users = Array.from(userMap.value.values())

    // 1. tc + giftPrice の合計
    const total = users.reduce((sum, user) => {
      return sum + (user.tc ?? 0) + (user.giftPrice ?? 0)
    }, 0)

    // 2. ユーザー数を掛ける
    return total * users.length
  })

  // ソート済みの表示用リスト
  const sortedUsers = computed(() => {
    const users = Array.from(userMap.value.values())
    return users.sort((a, b) => {
      const aVal = getSortValue(a, sortKey.value)
      const bVal = getSortValue(b, sortKey.value)
      return aVal - bVal
    })
  })

  function getSortValue(user: UserStatsRecord, key: SocialSortKey): number {
    if (key === 'isSyoken') return user.isSyoken ? 1 : 0
    return user[key] ?? 0
  }

  function registerUser(user: UserNameType): boolean {
    const userData = appStore.userSession.stats.get(user.userId)
    if (!userData) return false

    // 新規・既存問わず最新データで上書き
    userMap.value.set(user.userId, userData)
    return true
  }

  function clearAll() {
    userMap.value.clear()
  }

  return {
    sortedUsers,
    registerUser,
    clearAll,
    totalUsers: computed(() => userMap.value.size),
    streamScore,
  }
}
