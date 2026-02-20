// src/types/OmikujiData/ParsedDefault.ts
import { z } from 'zod'

// Zod schema に default({}) + catch({}) を付けるヘルパー
export function normalizedObject<T extends z.ZodTypeAny>(schema: T): z.ZodCatch<z.ZodDefault<T>> {
  const empty = schema.parse({})
  return (schema as any).default(empty).catch(empty)
}

//
export function normalizedRecord<T extends z.ZodTypeAny>(itemSchema: T) {
  return z.record(z.string(), itemSchema).default({}).catch({})
}

//
export function normalizedArray<T extends z.ZodTypeAny>(itemSchema: T) {
  return (z.array(itemSchema) as any).default([]).catch([])
}
