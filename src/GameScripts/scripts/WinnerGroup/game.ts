// src/GameScripts/scripts/WinnerGroup/game.ts
import { CANDIDATE_NAMES } from '@/MainGenerator/ui/GameRanking/parts/dummyConstants'
import { UserManager } from '@main/stores/UserManager/UserManager'
import { UserNameSchema, UserNameType } from '@shared/types'

export function getWinnersFromVisitManager(
  count: number,
  ruleKey?: string | null,
  userSession?: UserManager
): UserNameType[] {
  if (!userSession) return getDummyWinners(count)

  try {
    const rawWinners = ruleKey
      ? userSession.visits.drawWinners(ruleKey, count).winners // ruleKey あり → visits
      : userSession.stats.drawWinners(count).winners // ruleKey なし → stats 全体

    const winners = rawWinners.map((r) => UserNameSchema.parse(r))
    return winners.length > 0 ? winners : getDummyWinners(count)
  } catch {
    return getDummyWinners(count)
  }
}

function getDummyWinners(count: number): UserNameType[] {
  const max = Math.min(count, CANDIDATE_NAMES.length)
  const shuffled = [...CANDIDATE_NAMES].sort(() => Math.random() - 0.5)

  return shuffled.slice(0, max).map((name, index) =>
    UserNameSchema.parse({
      userName: name,
      userId: `dummy-${index}`,
    })
  )
}
