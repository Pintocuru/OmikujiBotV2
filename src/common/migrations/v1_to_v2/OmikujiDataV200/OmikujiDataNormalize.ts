// src/common/migrations/v1_to_v2/OmikujiDataV200/OmikujiDataNormalize.ts
import { z } from 'zod'
import { BaseRecordType } from '@shared/types'

/**
 * id/orderの型
 */
export type RecordCategoryItem = BaseRecordType & { [key: string]: any }

/**
 * アイテム配列のorder値を正規化する
 * @param items - 正規化対象のアイテム配列
 * @returns order値が1から連番になったアイテム配列
 */
export const normalizeOrders = <T extends RecordCategoryItem>(items: T[]): T[] => {
  if (!Array.isArray(items) || items.length === 0) return items

  const sortedItems = [...items].sort((a, b) => {
    if (a.order === b.order) return a.key.localeCompare(b.key)
    return a.order - b.order
  })

  return sortedItems.map((item, index) => ({ ...item, order: index + 1 }))
}

/**
 * アイテム配列のID重複を解決し、一意なIDを保証する
 * @param items - ID重複解決対象のアイテム配列
 * @returns 一意なIDを持つアイテム配列
 */
export const ensureUniqueIds = <T extends { id: string }>(items: T[]): T[] => {
  const newItems: T[] = []
  const seenIds = new Set<string>()

  for (const item of items) {
    let newId = item.id
    if (seenIds.has(newId)) newId = `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`
    seenIds.add(newId)
    newItems.push(newId === item.id ? item : { ...item, id: newId })
  }
  return newItems
}

/**
 * 正規化機能付きRecordスキーマを作成する
 * @param itemSchema - 個別アイテムのZodスキーマ
 * @returns 正規化機能を含むRecordスキーマ
 */
export const recordNormalization = <T extends z.ZodType<RecordCategoryItem>>(itemSchema: T) => {
  return z
    .record(z.string(), itemSchema)
    .default({})
    .catch({})
    .transform((record) => {
      if (!record || typeof record !== 'object') return {}

      const items: z.infer<T>[] = Object.values(record)
      const uniqueItems = ensureUniqueIds(items)
      const orderNormalizedItems = normalizeOrders(uniqueItems)

      const result: Record<string, z.infer<T>> = {}
      orderNormalizedItems.forEach((item) => {
        result[item.key] = item
      })
      return result
    })
}
