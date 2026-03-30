// src/MainGenerator/ui/SocialRoster/composables/useSocialRosterManager.ts
import { ref, computed, type Ref } from 'vue'
import { UserNameType } from '@shared/types'
import { SocialRosterCounts, UserStatsRecord } from '@/types'
import { useAppStore } from '@main/stores/useAppStore'
import { SocialSortKey } from '@/types'
import { calcStreamScore, sortUsers } from './socialRosterLogic'

export function useSocialRosterManager(sortKey: Ref<SocialSortKey>) {
  const appStore = useAppStore()
  const userMap = ref<Map<string, UserStatsRecord>>(new Map())

  const sortedUsers = computed(() => sortUsers(userMap.value.values(), sortKey.value))

  const counts = computed<SocialRosterCounts>(() => {
    const users = Array.from(userMap.value.values())
    const streamScore = calcStreamScore(users)

    let syokenCount = 0
    for (const u of users) if (u.isSyoken) syokenCount++

    return {
      streamScore,
      syokenCount,
      userCount: users.length,
    }
  })

  function registerUser(user: UserNameType): boolean {
    const userData = appStore.userSession.stats.get(user.userId)
    if (!userData) return false
    userMap.value.set(user.userId, userData)
    return true
  }

  function clearAll() {
    userMap.value.clear()
  }

  return {
    sortedUsers,
    counts,
    registerUser,
    clearAll,
  }
}
