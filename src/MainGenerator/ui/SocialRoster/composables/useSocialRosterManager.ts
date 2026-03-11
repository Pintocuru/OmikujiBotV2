// src/MainGenerator/ui/SocialRoster/composables/useSocialRosterManager.ts
import { ref, computed, type Ref } from 'vue'
import { UserNameType } from '@shared/types'
import { UserStatsRecord } from '@/types'
import { useAppStore } from '@main/stores/useAppStore'
import { SocialSortKey } from '@/types'

interface SocialRosterManagerOptions {
  sortKey: Ref<SocialSortKey>
  sortOrder: Ref<'desc' | 'asc'>
}

export function useSocialRosterManager(options: SocialRosterManagerOptions) {
  const appStore = useAppStore()
  const { sortKey, sortOrder } = options

  // userId → UserStatsRecord のMap（全員保持）
  const userMap = ref<Map<string, UserStatsRecord>>(new Map())

  // ソート済みの表示用リスト
  const sortedUsers = computed(() => {
    const users = Array.from(userMap.value.values())
    return users.sort((a, b) => {
      const aVal = getSortValue(a, sortKey.value)
      const bVal = getSortValue(b, sortKey.value)
      return sortOrder.value === 'desc' ? bVal - aVal : aVal - bVal
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
  }
}
