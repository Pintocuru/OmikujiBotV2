// src/types/OmikujiData/JsonMergeType.ts
import { z } from 'zod'
import { BaseRecordSchema } from '@shared/types'

export const JsonMergeRemapSchema = z.object({
  fromCharacterKey: z.string().default(''),
  toCharacterKey: z.string().default(''),
  fromIconKey: z.string().default(''),
  toIconKey: z.string().default(''),
})

export const JsonMergeItemSchema = z.object({
  ...BaseRecordSchema.shape,
  sourceFile: z.string().default(''),
  keySuffix: z.string().default(''),
  remaps: z.array(JsonMergeRemapSchema).default([]),
})

export const JsonMergeSchema = z.array(JsonMergeItemSchema)

export type JsonMergeType = z.infer<typeof JsonMergeSchema>
export type JsonMergeItemType = z.infer<typeof JsonMergeItemSchema>
export type JsonMergeRemapType = z.infer<typeof JsonMergeRemapSchema>
