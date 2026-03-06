import { ExtraListsSchema, SettingsRankingType } from '@/types/'
import { BotMessageExtraSchema, BotMessageExtraType } from '@/types/MainGenerator/BotMessageSchema'
import {
  UserStatsRecord,
  UserStatsRecordSchema,
  UserVisitRecord,
  UserVisitRecordSchema,
} from '@/types/MainGenerator/UserVisits'
import {
  CANDIDATE_NAMES,
  NAME_SUFFIXES,
  RANKING_POINTS_RANGE,
  SUFFIX_PROBABILITY,
  USER_STATS_RANGES,
} from './dummyConstants'

// -------------------------------------------------------------------
// ユーティリティ
// -------------------------------------------------------------------

/** [min, max] の整数乱数 */
const randInt = (min: number, max: number): number => Math.floor(Math.random() * (max - min + 1)) + min

/** CANDIDATE_NAMES からランダムに 1 件取得 */
const pickName = (): string => CANDIDATE_NAMES[Math.floor(Math.random() * CANDIDATE_NAMES.length)]

/** 確率でサフィックスを付加したユーザー名を生成 */
const buildUserName = (): string => {
  const base = pickName()
  if (Math.random() >= SUFFIX_PROBABILITY) return base
  const suffix = NAME_SUFFIXES[Math.floor(Math.random() * NAME_SUFFIXES.length)]
  return base + suffix
}

// -------------------------------------------------------------------
// 生成関数
// -------------------------------------------------------------------

/** プレビュー用: visitCount 付きのユーザーリストを生成 */
export const generateDummyVisitRecords = (count: number): UserVisitRecord[] => {
  const maxCount = Math.min(count, 300)

  return Array.from({ length: maxCount }, () => {
    const userName = buildUserName()
    return UserVisitRecordSchema.parse({
      userName,
      userId: userName,
      ruleId: 'dummy',
      visitCount: randInt(0, 100),
    })
  })
}

/** プレビュー用: tc / score / giftPrice などの統計付きユーザーリストを生成 */
export const generateDummyUserStats = (count: number): UserStatsRecord[] => {
  const { tc, score, giftPrice } = USER_STATS_RANGES
  const maxCount = Math.min(count, 300)

  return Array.from({ length: maxCount }, () => {
    const userName = buildUserName()
    return UserStatsRecordSchema.parse({
      userName,
      userId: userName,
      tc: randInt(tc.min, tc.max),
      score: randInt(score.min, score.max),
      giftPrice: Math.random() < giftPrice.zeroProbability ? 0 : randInt(giftPrice.min, giftPrice.max),
    })
  })
}

/** ランキング表示用のダミー BotMessage を生成 */
export const generateDummyMessages = (settings: SettingsRankingType): BotMessageExtraType[] => {
  const count = settings.limit ?? 10
  const usedNames = new Set<string>()
  const { min, max } = RANKING_POINTS_RANGE

  const messages: BotMessageExtraType[] = Array.from({ length: count }, () => {
    let listName: string
    do {
      listName = pickName()
    } while (usedNames.has(listName) && usedNames.size < CANDIDATE_NAMES.length)
    usedNames.add(listName)

    const points = randInt(min, max)
    return BotMessageExtraSchema.parse({
      scriptKey: 'none',
      lists: ExtraListsSchema.parse({
        listName,
        text: String(points),
        order: points,
      }),
    })
  })

  switch (settings.sortOrder) {
    case 'high':
      return messages.sort((a, b) => (b.lists?.order ?? 0) - (a.lists?.order ?? 0))
    case 'low':
      return messages.sort((a, b) => (a.lists?.order ?? 0) - (b.lists?.order ?? 0))
    case 'new':
    default:
      return messages
  }
}

/** WinnerGroup プレビュー用: 重複なしの当選者リストを生成 */
export const generateDummyWinnerUsers = (count: number = 2): UserVisitRecord[] => {
  const used = new Set<string>()

  return Array.from({ length: count }, (_, i) => {
    let name: string
    do {
      name = pickName()
    } while (used.has(name))
    used.add(name)

    return UserVisitRecordSchema.parse({
      userName: name,
      userId: `dummy-${i}-${Date.now()}`,
      ruleId: 'winner-preview',
      visitCount: randInt(1, 50),
    })
  })
}
