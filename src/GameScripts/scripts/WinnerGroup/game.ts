// src/game.ts
import { candidateNames } from '@/common/ui/GameRanking/useDummyBotMessages'
import { useAppStore } from '@/MainGenerator/stores/useAppStore'
import { UserVisitRecord, UserVisitRecordSchema } from '@/types/MainGenerator/UserVisits'

export function getWinnersFromVisitManager(count: number, ruleKey?: string | null): UserVisitRecord[] {
  try {
    const store = useAppStore()

    // store が無い or userVisitManager が無い
    if (!store?.userVisitManager) return getDummyWinners(count)

    const winners = store.userVisitManager.getLiveComment(count, ruleKey ?? undefined).winners
    return winners.length > 0 ? winners : getDummyWinners(count)
  } catch {
    // useAppStore() が例外を投げる環境（別アプリ）
    return getDummyWinners(count)
  }
}

// ★ ダミー WinnerGroup（candidateNames を使用）
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
