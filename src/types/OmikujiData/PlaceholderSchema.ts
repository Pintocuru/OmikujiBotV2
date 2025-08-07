// shared/types/OmikujiBot/PlaceholderSchema.ts
// 250722_1 の新規作成
import { z } from 'zod';
import { BaseSchema } from '@shared/types';

// PlaceholderSchema // OmikujiSchema
export const PlaceholderValueSchema = z.object({
 weight: z.number().min(0).default(1).catch(1),
 content: z.string().default('').catch('')
});

export const PlaceholderSchema = z.object({
 // ここはidではなくkeyが良いと言われた。idは別途作ると良いとも。
 ...BaseSchema.shape,
 editorColor: z
  .string()
  .regex(/^#[0-9A-Fa-f]{6}$/)
  .default('#3B82F6')
  .catch('#3B82F6'),
 values: z.array(PlaceholderValueSchema).default([]).catch([])
});

export type PlaceholderType = z.infer<typeof PlaceholderSchema>;
export type PlaceholderValueType = z.infer<typeof PlaceholderValueSchema>;
