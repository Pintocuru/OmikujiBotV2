// shared/types/OmikujiBot/PlaceholderSchema.ts
import { z } from 'zod'
import { BaseRecordSchema } from '@shared/types'
import { drawOmikuji } from '@shared/utils/omikuji/DrawOmikuji'

/**
 * PlaceholderValueObjectSchema: 重み付きのコンテンツオブジェクト
 */
export const PlaceholderValueObjectSchema = z.object({
  weight: z.number().min(0).default(1).catch(1),
  content: z.string().default('').catch(''),
})
export type PlaceholderValueType = z.infer<typeof PlaceholderValueObjectSchema>

/**
 * PlaceholderValuesSchema: 配列の要素を処理
 */
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

/**
 * PlaceholderSchema
 */
export const PlaceholderSchema = z.object({
  ...BaseRecordSchema.shape,
  values: PlaceholderValuesSchema,
})

export type PlaceholderType = z.infer<typeof PlaceholderSchema>

// PlaceholderValueType に修正する関数
export function handelNormalizedValues(values: Array<PlaceholderValueType | string>): PlaceholderValueType[] {
  return values.map((item) => {
    if (typeof item === 'string') return { content: item, weight: 1 }
    else return item
  })
}

// PlaceholderValueType から ランダム抽選で値を選択
export function selectValue(values: Array<PlaceholderValueType | string>): string {
  const normalizedValues = handelNormalizedValues(values)
  if (normalizedValues.length === 0) return ''

  const drawnValue = drawOmikuji(normalizedValues) as PlaceholderValueType
  return drawnValue.content || normalizedValues[0].content || ''
}
