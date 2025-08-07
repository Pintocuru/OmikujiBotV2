// types/OmikujiBot/OmikujiSchema.ts
// 250722_1 OmikujiLimits の新規作成
import { z } from 'zod';
import { CharacterEmotionSchema } from './CharacterSchema';
import { v4 as uuidv4 } from 'uuid';
import { POST_SETTINGS } from '@shared/sdk/postMessage/PostSettings';

// PostAction
export const PostActionSchema = z.object({
 characterKey: z.string().default('').catch(''),
 iconKey: CharacterEmotionSchema.default('default').catch('default'),
 delaySeconds: z
  .number()
  .min(POST_SETTINGS.basicDelaySeconds * -1)
  .default(0)
  .catch(0),
 wordParty: z.string().optional().catch(undefined),
 messageContent: z.string().default('').catch(''),
 messageToast: z.string().optional().catch(undefined)
});

// PostActionWordParty
export const PostActionWordPartySchema = z.object({
 delaySeconds: z.number().min(0).default(0).catch(0),
 wordParty: z.string().default('').catch('')
});

// Omikuji
export const OmikujiSetSchema = z.object({
 id: z
  .string()
  .default(() => uuidv4())
  .catch(() => uuidv4()),
 name: z.string().default('').catch(''),
 description: z.string().default('').catch(''),
 weight: z.number().min(0).default(1).catch(1),
 postActions: z.array(PostActionSchema).default([]).catch([])
});

export type PostActionType = z.infer<typeof PostActionSchema>;
export type PostActionWordPartyType = z.infer<typeof PostActionWordPartySchema>;
export type OmikujiSetType = z.infer<typeof OmikujiSetSchema>;
