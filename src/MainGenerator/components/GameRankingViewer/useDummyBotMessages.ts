// src/composables/useDummyBotMessages.ts
import { BotMessage, BotMessageSchema } from '@/types/BotComponents/BotMessageSchema'
import { SettingsRankingType } from '@/types/OmikujiData/DisplaySettingsSchema'

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

  'こばや',
  'しゃち',
  'ぷらす',
  'うかい',
  'りく',
  'まぐれ',
  'たかな',
  'みこ',
  'たかとら',
  'どすけべ',
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
export const generateDummyUserNames = (count: number): string[] => {
  const result: string[] = []
  const maxCount = Math.min(count, 300) // 最大200件まで

  for (let i = 0; i < maxCount; i++) {
    const baseName = candidateNames[Math.floor(Math.random() * candidateNames.length)]

    // 20% の確率で prefix を付与
    if (Math.random() < 0.2) {
      const prefix = prefixes[Math.floor(Math.random() * prefixes.length)]
      result.push(baseName + prefix)
    } else {
      result.push(baseName)
    }
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

    dummyMessages.push(
      BotMessageSchema.parse({
        name,
        comment: {
          rankingName: name,
          rankingPoint: String(points),
          rankingRank: String(i + 1),
          rankingKey: settings.scriptKey || 'dummy',
        },
      })
    )
  }

  if (settings.sortByHighScore) {
    return dummyMessages.sort((a, b) => (Number(b.comment?.rankingPoint) || 0) - (Number(a.comment?.rankingPoint) || 0))
  }

  return dummyMessages
}
