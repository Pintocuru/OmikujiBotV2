// src/MainGenerator/ui/SocialRoster/composables/socialRosterLogic.ts
import { UserStatsRecord, SocialSortKey } from '@/types'

export function getSortValue(user: UserStatsRecord, key: SocialSortKey): number {
  if (key === 'isSyoken') return user.isSyoken ? 1 : 0
  if (key === 'userName') return user.lastVisit ?? 0
  if (key === 'tc') return user.lastVisit ?? 0 // 総合コメントはソートしない
  return user[key] ?? 0
}

export function sortUsers(users: Iterable<UserStatsRecord>, key: SocialSortKey) {
  return [...users].sort((a, b) => {
    const aVal = getSortValue(a, key)
    const bVal = getSortValue(b, key)

    if (bVal !== aVal) return bVal - aVal
    return b.lastVisit - a.lastVisit
  })
}

export function calcStreamScore(users: Iterable<UserStatsRecord>): number {
  let total = 0
  let userCount = 0
  let syokenCount = 0

  for (const user of users) {
    total += (user.tc ?? 0) + (user.giftPrice ?? 0)
    userCount++
    if (user.isSyoken) syokenCount++
  }

  return Math.floor(total * Math.sqrt(userCount) * (1 + syokenCount * 0.1))
}
