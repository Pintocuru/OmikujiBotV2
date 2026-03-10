// src/GameScripts/scripts/WinnerGroup/game.ts
import { generateDummyWinnerUsers } from '@/common/MockUser/MockGenerators'
import { UserManager } from '@main/stores/UserManager/UserManager'
import { UserNameSchema, UserNameType } from '@shared/types'

export function getWinnersFromVisitManager(
  count: number,
  eventKey?: string | null,
  userSession?: UserManager
): UserNameType[] {
  if (!userSession) return generateDummyWinnerUsers(count)

  try {
    const rawWinners = eventKey
      ? userSession.visits.drawWinners(eventKey, count).winners // ruleKey あり → visits
      : userSession.stats.drawWinners(count).winners // ruleKey なし → stats 全体

    const winners = rawWinners.map((r) => UserNameSchema.parse(r))
    return winners.length > 0 ? winners : generateDummyWinnerUsers(count)
  } catch {
    return generateDummyWinnerUsers(count)
  }
}
