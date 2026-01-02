// src\types\MainGenerator\UserVisits.ts
import { z } from 'zod'
import { UserNameSchema } from '../OmikujiData/ActionMessage'

export const UserVisitRecordSchema = z.object({
  ...UserNameSchema.shape,
  ruleId: z.string(),
  visitCount: z.number(),
})
export type UserVisitRecord = z.infer<typeof UserVisitRecordSchema>
