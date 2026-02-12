// src/composables/useDummyBotMessages.ts
import { ExtraListsSchema, SettingsRankingType } from '@/types/'
import { BotMessageExtraSchema, BotMessageExtraType } from '@/types/MainGenerator/BotMessageSchema'
import { UserVisitRecord, UserVisitRecordSchema } from '@/types/MainGenerator/UserVisits'

export const candidateNames = [
  'てい',
  'ポッピィー',
  'おふとん',
  'もこもこ',
  'じゅん',
  'たかゆき',
  'すいすい',
  'たいよう',
  'ふわみ',
  'いろは',

  'なな',
  'きよし',
  'おとは',
  'こはく',
  'さくら',
  'ぽこら',
  'あくま',
  'りきいち',
  'せいじん',
  'はじめ',

  'かるび',
  'みく',
  'あおい',
  'こばや',
  'くいず',
  'さーくら',
  'しゃち',
  'とうほく',
  'ねこ',

  'ぷらす',
  'うかい',
  'りく',
  'まぐれ',
  'たかな',
  'みこ',
  'たかとら',
  'どすけべ',
  'せすぴん',
  '渋谷区大型デパートヨコセヨ',
]

// Youtuber風の prefix（一般に存在しなそうなもの）
const prefixes = [
  'チャンネル',
  'TV',
  'Games',
  'Studio',
  'Lab',
  'Project',
  'Works',
  'Club',
  'Factory',
  'Show',
  'Tube',
  'Records',
]

// プレビュー用: 毎回ランダムにユーザー名を生成
export const generateDummyUserNames = (count: number): UserVisitRecord[] => {
  const result: UserVisitRecord[] = []
  const maxCount = Math.min(count, 300)

  for (let i = 0; i < maxCount; i++) {
    const baseName = candidateNames[Math.floor(Math.random() * candidateNames.length)]

    const userName = Math.random() < 0.2 ? baseName + prefixes[Math.floor(Math.random() * prefixes.length)] : baseName

    result.push(
      UserVisitRecordSchema.parse({
        userName,
        userId: userName,
        ruleId: 'dummy',
        visitCount: Math.floor(Math.random() * 100),
      })
    )
  }
  return result
}

// ランダムな BotMessage を生成
export const generateDummyMessages = (settings: SettingsRankingType): BotMessageExtraType[] => {
  const count = settings.limit || 10
  const usedNames = new Set<string>()
  const dummyMessages: BotMessageExtraType[] = []

  for (let i = 0; i < count; i++) {
    let listName: string
    do {
      listName = candidateNames[Math.floor(Math.random() * candidateNames.length)]
    } while (usedNames.has(listName) && usedNames.size < candidateNames.length)

    usedNames.add(listName)

    const points = Math.floor(Math.random() * (3000 - 1000 + 1)) + 1000

    dummyMessages.push(
      BotMessageExtraSchema.parse({
        componentKey: 'dummy',
        lists: ExtraListsSchema.parse({
          listName,
          text: String(points),
          order: points,
        }),
      })
    )
  }

  switch (settings.sortOrder) {
    case 'high':
      return dummyMessages.sort((a, b) => (b.lists?.order || 0) - (a.lists?.order || 0))
    case 'low':
      return dummyMessages.sort((a, b) => (a.lists?.order || 0) - (b.lists?.order || 0))
    case 'new':
    default:
      return dummyMessages
  }
}

// WinnerGroup プレビュー専用
export const generateDummyWinnerUsers = (count: number = 2): UserVisitRecord[] => {
  const result: UserVisitRecord[] = []
  const used = new Set<string>()

  for (let i = 0; i < count; i++) {
    let name: string
    do {
      name = candidateNames[Math.floor(Math.random() * candidateNames.length)]
    } while (used.has(name))

    used.add(name)

    result.push(
      UserVisitRecordSchema.parse({
        userName: name,
        userId: `dummy-${i}-${Date.now()}`,
        ruleId: 'winner-preview',
        visitCount: Math.floor(Math.random() * 50) + 1,
      })
    )
  }

  return result
}
