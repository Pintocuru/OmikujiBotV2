// src\types\OmikujiData\WordPartySettings.ts
import { z } from 'zod'

// WordParty設定のスキーマ
export const WordPartySettingsSchema = z.object({
  name: z.string().default('').catch(''), // WordPartyの名前
  pattern: z.string().default('').catch(''), // WordPartyのパターン
})

export type WordPartySettings = z.infer<typeof WordPartySettingsSchema>
