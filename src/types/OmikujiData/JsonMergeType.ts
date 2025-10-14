// src\types\OmikujiData\JsonMergeType.ts
import { z } from 'zod'

export const JsonMergeRemapSchema = z.object({
  fromCharacterKey: z.string(),
  toCharacterKey: z.string(),
  fromIconKey: z.string(),
  toIconKey: z.string(),
})

export const JsonMergeItemSchema = z.object({
  sourceFile: z.string(),
  remaps: z.array(JsonMergeRemapSchema),
})

export const JsonMergeSchema = z.array(JsonMergeItemSchema)

export type JsonMergeType = z.infer<typeof JsonMergeSchema>
export type JsonMergeItemType = z.infer<typeof JsonMergeItemSchema>
