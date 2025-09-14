// shared/types/OmikujiBot/PlaceholderSchema.ts
import { z } from 'zod'
import { BaseRecordSchema } from '@shared/types'

// PlaceholderValueObjectSchema: 重み付きのコンテンツオブジェクトを定義
export const PlaceholderValueObjectSchema = z.object({
  weight: z.number().min(0).default(1).catch(1),
  content: z.string().default('').catch(''),
})

// PlaceholderValuesSchema: 配列の要素を処理するスキーマ
// オブジェクトが特定条件を満たす場合に文字列に変換するロジックを内包
export const PlaceholderValuesSchema = z
  .array(
    z.union([PlaceholderValueObjectSchema, z.string()]).transform((value) => {
      // オブジェクトかつ weight が 1 で、他のプロパティがない場合に string に変換
      if (typeof value === 'object' && value.weight === 1) {
        // content 以外のキーがないことを確認
        const keys = Object.keys(value)
        if (keys.length === 2 && keys.includes('weight') && keys.includes('content')) {
          return value.content
        }
      }
      return value
    })
  )
  .default([PlaceholderValueObjectSchema.parse({})])
  .catch([])

// PlaceholderSchema: 新設した PlaceholderValuesSchema を使用
export const PlaceholderSchema = z.object({
  ...BaseRecordSchema.shape,
  values: PlaceholderValuesSchema,
  // TODO:v1.2で実装
  mapType: z.enum(['mapDaily', 'mapHourly', 'mapWeekly', 'mapMonthly']).optional(),
})

export type PlaceholderType = z.infer<typeof PlaceholderSchema>
export type PlaceholderValueType = z.infer<typeof PlaceholderValueObjectSchema>

// PlaceholderValueType に修正する関数
export function handelNormalizedValues(values: Array<PlaceholderValueType | string>): PlaceholderValueType[] {
  return values.map((item) => {
    if (typeof item === 'string') {
      return { content: item, weight: 1 }
    } else {
      return item
    }
  })
}
