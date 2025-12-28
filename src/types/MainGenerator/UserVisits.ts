// C:\_root\_nodejs\OmikenTemplates\templates\OmikujiBot\src\types\MainGenerator\UserVisits.ts
import { z } from 'zod'
import { UserNameSchema } from '../OmikujiData/PostActionMessage'

export const UserVisitRecordSchema = z.object({
  ...UserNameSchema.shape,
  ruleId: z.string(),
  visitCount: z.number(),
})
export type UserVisitRecord = z.infer<typeof UserVisitRecordSchema>
