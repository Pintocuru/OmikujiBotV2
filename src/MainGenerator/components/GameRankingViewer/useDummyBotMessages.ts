// src/composables/useDummyBotMessages.ts
import { RankingMessageSchema, UserNameSchema } from '@/types'
import { BotMessage, BotMessageSchema } from '@/types/MainGenerator/BotMessageSchema'
import { UserVisitRecord, UserVisitRecordSchema } from '@/types/MainGenerator/UserVisits'
import { SettingsRankingType } from '@/types/OmikujiData/DisplaySettingsSchema'
import { vi } from 'zod/v4/locales'

const candidateNames = [
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

    const name = Math.random() < 0.2 ? baseName + prefixes[Math.floor(Math.random() * prefixes.length)] : baseName

    result.push(
      UserVisitRecordSchema.parse({
        name,
        userId: name,
        ruleId: 'dummy',
        visitCount: Math.floor(Math.random() * 100),
      })
    )
  }
  return result
}

// ランダムな BotMessage を生成
export const generateDummyMessages = (settings: SettingsRankingType): BotMessage[] => {
  const count = settings.limit || 10
  const usedNames = new Set<string>()
  const dummyMessages: BotMessage[] = []

  for (let i = 0; i < count; i++) {
    let name: string
    do {
      name = candidateNames[Math.floor(Math.random() * candidateNames.length)]
    } while (usedNames.has(name) && usedNames.size < candidateNames.length)

    usedNames.add(name)

    const points = Math.floor(Math.random() * (3000 - 1000 + 1)) + 1000

    const ranking = RankingMessageSchema.parse({
      scriptKey: settings.scriptKey || 'dummy',
      name,
      scoreText: String(points),
      scoreValue: points,
    })

    dummyMessages.push(
      BotMessageSchema.parse({
        name,
        message: {
          ranking,
        },
      })
    )
  }

  switch (settings.sortOrder) {
    case 'high':
      return dummyMessages.sort((a, b) => (b.message.ranking?.scoreValue || 0) - (a.message.ranking?.scoreValue || 0))
    case 'low':
      return dummyMessages.sort((a, b) => (a.message.ranking?.scoreValue || 0) - (b.message.ranking?.scoreValue || 0))
    case 'new':
    default:
      return dummyMessages
  }
}
