// src/types/OmikujiData/CriteriaThresholdSchema.ts
import { z } from 'zod'
import { GiftConditionSchema, SyokenConditionSchema } from '@shared/types/Threshold/'
import { AccessConditionSchema, CountConditionSchema } from '@shared/types/trigger'
import { criteriaThresholdCondition } from '../MetaMaps'

/**
 * criteria Threshold
 */
export const CriteriaThresholdSchema = z.object({
  conditions: z.array(z.enum(criteriaThresholdCondition)).catch([]),
  userName: z.array(z.string()).catch([]),
  access: z.array(AccessConditionSchema).catch([]),
  gift: z.array(GiftConditionSchema).catch([]),
  syoken: z.array(SyokenConditionSchema).catch([]),
  count: CountConditionSchema.catch(CountConditionSchema.parse({})),
  comment: z.array(z.string()).catch([]),
})
export type CriteriaThresholdType = z.infer<typeof CriteriaThresholdSchema>
