// src/types/OmikujiData/PlaceholderSchema.ts
import { z } from 'zod'
import { BaseRecordSchema } from '@shared/types'

/**
 * WeightValueSchema: 重み付きのコンテンツオブジェクト
 */
export const WeightValueSchema = z.object({
  weight: z.number().min(0).default(1).catch(1),
  content: z.string().default('').catch(''),
})
export type WeightValueType = z.infer<typeof WeightValueSchema>

/**
 * WeightValuesArraySchema: 配列の要素を処理
 */
export const WeightValuesArraySchema = z
  .array(
    z.union([WeightValueSchema, z.string()]).transform((value) => {
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
  .default([WeightValueSchema.parse({})])
  .catch([])
export type WeightValuesArrayType = z.infer<typeof WeightValuesArraySchema>

/**
 * PlaceholderSchema
 */
export const PlaceholderSchema = z.object({
  ...BaseRecordSchema.shape,
  values: WeightValuesArraySchema,
})

export type PlaceholderType = z.infer<typeof PlaceholderSchema>

// PlaceholderValueType に修正する関数
export function handelNormalizedValues(values: WeightValuesArrayType): WeightValueType[] {
  return values.map((item) => {
    if (typeof item === 'string') return { content: item, weight: 1 }
    else return item
  })
}
