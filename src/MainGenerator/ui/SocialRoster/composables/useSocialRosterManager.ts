// src/MainGenerator/ui/SocialRoster/composables/useSocialRosterManager.ts
import { ref, computed, type Ref } from 'vue'
import { UserNameType } from '@shared/types'
import { UserStatsRecord } from '@/types'
import { useAppStore } from '@main/stores/useAppStore'
import { SocialSortKey } from '@/types'
import { calcStreamScore, sortUsers } from './socialRosterLogic'

export function useSocialRosterManager(sortKey: Ref<SocialSortKey>) {
  const appStore = useAppStore()
  const userMap = ref<Map<string, UserStatsRecord>>(new Map())

  const sortedUsers = computed(() => sortUsers(userMap.value.values(), sortKey.value))

  const streamScore = computed(() => calcStreamScore(userMap.value.values()))

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
    streamScore,
    registerUser,
    clearAll,
    totalUsers: computed(() => userMap.value.size),
  }
}
