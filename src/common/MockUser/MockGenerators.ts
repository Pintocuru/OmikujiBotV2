// src/common/MockUser/MockGenerators.ts
import { ExtraListsSchema, GameRankingType } from '@/types'
import { BotMessageExtraSchema, BotMessageExtraType } from '@/types/MainGenerator/BotMessageSchema'
import {
  UserStatsRecord,
  UserStatsRecordSchema,
  UserVisitRecord,
  UserVisitRecordSchema,
} from '@/types/MainGenerator/UserVisits'
import { LocaleType } from '@/types/OmikujiData/'
import { RANKING_POINTS_RANGE, SUFFIX_PROBABILITY, USER_STATS_RANGES } from './MockConstants'
import { MOCK_FAMILY_NAME_JA_LIST, MOCK_USER_GIVEN_JA_LIST } from './MockUserJaMaps'
import { NAME_SUFFIXES } from './MockUserMaps'

// -------------------------------------------------------------------
// ロケール別マップの型定義
// -------------------------------------------------------------------

/** ロケール別 given-name リスト */
const GIVEN_NAME_LIST_MAP: Partial<Record<LocaleType, { label: string; avatarStyle: string }[]>> = {
  ja: MOCK_USER_GIVEN_JA_LIST,
  // en: MOCK_USER_GIVEN_EN_LIST,  // 追加予定
}

/** ロケール別 family-name リスト */
const FAMILY_NAME_LIST_MAP: Partial<Record<LocaleType, string[]>> = {
  ja: MOCK_FAMILY_NAME_JA_LIST,
  // en: MOCK_FAMILY_NAME_EN_LIST,  // 追加予定
}

/** フォールバック先ロケール */
const FALLBACK_LOCALE: LocaleType = 'ja'

// -------------------------------------------------------------------
// ユーティリティ
// -------------------------------------------------------------------

// [min, max] の整数乱数
const randInt = (min: number, max: number): number => Math.floor(Math.random() * (max - min + 1)) + min

// 配列からランダムに 1 件取得
const pickRandom = <T>(arr: readonly T[]): T => arr[Math.floor(Math.random() * arr.length)]

// ロケールに対応した given-name エントリをランダムに 1 件取得
const pickGivenName = (locale: LocaleType): { label: string; avatarStyle: string } => {
  const list = GIVEN_NAME_LIST_MAP[locale] ?? GIVEN_NAME_LIST_MAP[FALLBACK_LOCALE] ?? []
  return pickRandom(list)
}

// ロケールに対応した family-name をランダムに 1 件取得（存在しない場合は undefined）
const pickFamilyName = (locale: LocaleType): string | undefined => {
  const list = FAMILY_NAME_LIST_MAP[locale] ?? FAMILY_NAME_LIST_MAP[FALLBACK_LOCALE]
  if (!list || list.length === 0) return undefined
  return pickRandom(list)
}

/**
 * ロケールを受け取り、確率で family-name・suffix を付加したユーザー名を生成する。
 * - family-name : SUFFIX_PROBABILITY で付与（LocaleType の影響を受ける）
 * - NAME_SUFFIXES: SUFFIX_PROBABILITY で付与（LocaleType の影響を受けない）
 */
const buildUserName = (locale: LocaleType): string => {
  const { label: baseName } = pickGivenName(locale)

  // family-name を確率で先頭に付与
  const familyName = Math.random() < SUFFIX_PROBABILITY ? pickFamilyName(locale) : undefined
  const nameWithFamily = familyName ? `${familyName} ${baseName}` : baseName

  // NAME_SUFFIXES を確率で末尾に付与（ロケール非依存）
  if (Math.random() < SUFFIX_PROBABILITY) {
    const suffix = pickRandom(NAME_SUFFIXES)
    return nameWithFamily + suffix
  }

  return nameWithFamily
}

// ロケールに対応した given-name の総数（重複なし抽選の上限として使用）
const givenNameCount = (locale: LocaleType): number =>
  (GIVEN_NAME_LIST_MAP[locale] ?? GIVEN_NAME_LIST_MAP[FALLBACK_LOCALE] ?? []).length

// -------------------------------------------------------------------
// 生成関数
// -------------------------------------------------------------------

// プレビュー用: visitCount 付きのユーザーリストを生成
export const generateDummyVisitRecords = (count: number, locale: LocaleType = 'ja'): UserVisitRecord[] => {
  const maxCount = Math.min(count, 300)

  return Array.from({ length: maxCount }, () => {
    const userName = buildUserName(locale)
    return UserVisitRecordSchema.parse({
      userName,
      userId: userName,
      eventKey: 'dummy',
      visits: randInt(0, 100),
      visitValue: randInt(0, 100),
    })
  })
}

// プレビュー用: tc / score / giftPrice などの統計付きユーザーリストを生成
export const generateDummyUserStats = (count: number, locale: LocaleType = 'ja'): UserStatsRecord[] => {
  const { tc, no, score, giftPrice } = USER_STATS_RANGES
  const maxCount = Math.min(count, 300)
  let previewIdCounter = 0

  return Array.from({ length: maxCount }, () => {
    const userName = buildUserName(locale)
    return UserStatsRecordSchema.parse({
      userName,
      userId: `${userName}-${previewIdCounter++}`,
      isSyoken: Math.random() < 0.05,
      tc: randInt(tc.min, tc.max),
      no: randInt(no.min, no.max),
      score: randInt(score.min, score.max),
      giftPrice: Math.random() < giftPrice.zeroProbability ? 0 : randInt(giftPrice.min, giftPrice.max),
    })
  })
}

// ランキング表示用のダミー BotMessage を生成
export const generateDummyMessages = (settings: GameRankingType, locale: LocaleType = 'ja'): BotMessageExtraType[] => {
  const count = settings.limit ?? 10
  const usedNames = new Set<string>()
  const { min, max } = RANKING_POINTS_RANGE
  const nameLimit = givenNameCount(locale)

  const messages: BotMessageExtraType[] = Array.from({ length: count }, () => {
    let listName: string
    do {
      listName = pickGivenName(locale).label
    } while (usedNames.has(listName) && usedNames.size < nameLimit)
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

// WinnerGroup プレビュー用: 重複なしの当選者リストを生成
export const generateDummyWinnerUsers = (count: number = 2, locale: LocaleType = 'ja'): UserVisitRecord[] => {
  const used = new Set<string>()

  return Array.from({ length: count }, (_, i) => {
    let name: string
    do {
      name = pickGivenName(locale).label
    } while (used.has(name))
    used.add(name)

    return UserVisitRecordSchema.parse({
      userName: name,
      userId: `dummy-${i}-${Date.now()}`,
      eventKey: 'winner-preview',
      visits: randInt(1, 50),
      visitValue: randInt(1, 50),
    })
  })
}
