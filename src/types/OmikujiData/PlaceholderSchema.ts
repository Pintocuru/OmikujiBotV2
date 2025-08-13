// shared/types/OmikujiBot/PlaceholderSchema.ts
// 250722_1 の新規作成
import { z } from 'zod';
import { BaseRecordSchema } from '@omiken/shared/types';

// PlaceholderSchema // OmikujiSchema
export const PlaceholderValueSchema = z.object({
 weight: z.number().min(0).default(1).catch(1),
 content: z.string().default('').catch('')
});

export const PlaceholderSchema = z.object({
 ...BaseRecordSchema.shape,
 values: z.array(PlaceholderValueSchema).default([]).catch([])
});

export type PlaceholderType = z.infer<typeof PlaceholderSchema>;
export type PlaceholderValueType = z.infer<typeof PlaceholderValueSchema>;
