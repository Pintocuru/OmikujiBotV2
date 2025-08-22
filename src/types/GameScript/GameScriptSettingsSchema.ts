// shared/types/GameScriptSettingsSchema.ts
import { z } from 'zod'
import { ParameterItem, ScriptPreset } from './GameScriptTypes'

/**
 * scriptGameMapから動的にスキーマを生成する関数
 * デフォルト値の生成に必要
 */
function createScriptSettingsSchema<T extends Record<string, ScriptPreset>>(
  gameScriptMap: T
): z.ZodObject<{ [K in keyof T]: z.ZodTypeAny }> {
  const schemaShape: any = {}

  for (const key in gameScriptMap) {
    const preset = gameScriptMap[key]
    if (preset.settings?.length) {
      const settingShape: any = {}
      for (const item of preset.settings) {
        settingShape[item.key] = createZodSchemaFromInputType(item)
      }
      schemaShape[key] = z.object(settingShape).default({}).catch({})
    } else {
      schemaShape[key] = z
        .record(z.string(), z.union([z.string(), z.number(), z.boolean()]))
        .default({})
        .catch({})
    }
  }
  return z.object(schemaShape as { [K in keyof T]: z.ZodTypeAny })
}

/**
 * createScriptSettingsSchema の簡易版
 */
export const scriptSettingsSchema = z.record(z.string(), z.record(z.string(), z.any())).default({}).catch({})

/**
 * 単一の scriptId に対応する ScriptParams のスキーマを生成
 */
export function createScriptParamsSchema(scriptId: string, gameScriptMap: Record<string, ScriptPreset>): z.ZodTypeAny {
  const shape: Record<string, z.ZodTypeAny> = {}
  const preset = gameScriptMap[scriptId]
  if (!preset || !preset.params) return z.object(shape).default({}).catch({})

  for (const params of preset.params) {
    shape[params.key] = createZodSchemaFromInputType(params)
  }

  return z.object(shape).default({}).catch({})
}

/**
 * ParameterItemのinputTypeから対応するZodスキーマを生成するヘルパー関数
 */
function createZodSchemaFromInputType(item: ParameterItem): z.ZodTypeAny {
  switch (item.inputType) {
    case 'string':
      if (item.values && item.values.length > 0) {
        const enumValues = item.values.map(String) as [string, ...string[]]
        return z.enum(enumValues).default(String(item.defaultValue)).catch(String(item.defaultValue))
      }
      return z
        .string()
        .default(item.defaultValue as string)
        .catch(item.defaultValue as string)

    case 'number':
      let numberSchema = z.coerce.number()
      if (typeof item.min === 'number') numberSchema = numberSchema.min(item.min)
      if (typeof item.max === 'number') numberSchema = numberSchema.max(item.max)
      return numberSchema.default(item.defaultValue as number).catch(item.defaultValue as number)

    case 'boolean':
      return z.coerce
        .boolean()
        .default(item.defaultValue as boolean)
        .catch(item.defaultValue as boolean)

    case 'select':
      if (!item.values || item.values.length === 0) {
        return z.string().default(String(item.defaultValue)).catch(String(item.defaultValue))
      }
      const enumValues = item.values.map(String) as [string, ...string[]]
      return z.enum(enumValues).default(String(item.defaultValue)).catch(String(item.defaultValue))

    default:
      return z.any().default(item.defaultValue).catch(item.defaultValue)
  }
}
