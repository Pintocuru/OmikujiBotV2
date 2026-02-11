// src/game.ts
import { candidateNames } from '@/common/ui/GameRanking/useDummyBotMessages'
import { UserVisitRecord, UserVisitRecordSchema } from '@/types/MainGenerator/UserVisits'
import { UserVisitManager } from '@main/stores/UserVisitManager/UserVisitManager'

// ★ UserVisitManagerを外部から注入できるように変更
export function getWinnersFromVisitManager(
  count: number,
  ruleKey?: string | null,
  visitManager?: UserVisitManager
): UserVisitRecord[] {
  if (!visitManager) return getDummyWinners(count)

  try {
    const winners = visitManager.getLiveComment(count, ruleKey ?? undefined).winners
    return winners.length > 0 ? winners : getDummyWinners(count)
  } catch {
    return getDummyWinners(count)
  }
}

function getDummyWinners(count: number): UserVisitRecord[] {
  const max = Math.min(count, candidateNames.length)
  const shuffled = [...candidateNames].sort(() => Math.random() - 0.5)

  return shuffled.slice(0, max).map((name, index) =>
    UserVisitRecordSchema.parse({
      userName: name,
      userId: `dummy-${index}`,
      ruleId: 'dummy',
      visitCount: 0,
    })
  )
}
