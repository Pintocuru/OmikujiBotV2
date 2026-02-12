// src/GameScripts/scripts/WinnerGroup/game.ts
import { candidateNames } from '@main/ui/GameRanking/parts/useDummyBotMessages'
import { UserVisitRecord, UserVisitRecordSchema } from '@/types/MainGenerator/UserVisits'

export function getWinnersFromVisitManager(count: number, _ruleKey?: string | null): UserVisitRecord[] {
  return getDummyWinners(count)
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
