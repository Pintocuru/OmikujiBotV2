// src/common/migrations/v2_to_v3/v2_04_to_v2_05.ts
import { nanoid } from 'nanoid'

export function migrateV204ToV205(data: any) {
  resetOmikujiIdsInRules(data.comments)
  resetOmikujiIdsInRules(data.timers)
  resetOmikujiIdsInRules(data.metas)

  data.meta.dataVersion = 2.05
  return data
}

function resetOmikujiIdsInRules(record: Record<string, any> | undefined | null) {
  if (!record) return

  for (const rule of Object.values(record)) {
    if (!Array.isArray(rule.omikuji)) continue

    rule.omikuji = rule.omikuji.map((item: any) => ({
      ...item,
      id: nanoid(),
    }))
  }
}
