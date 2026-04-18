// tools/JsonMerge/merger.ts
import { OmikujiDataType, eventCategoryLabel, EventCategoryType, FlagsUsageType } from '@/types'
import { ACCESS_LEVEL_PRIORITY } from '@/ConfigMaker/stores/composables/useDataMergeHelpers'
import { AccessLevelType } from '@shared/types'

const mergeAccessLevel = (current: AccessLevelType, incoming: AccessLevelType): AccessLevelType => {
  const currentPriority = ACCESS_LEVEL_PRIORITY.indexOf(current)
  const incomingPriority = ACCESS_LEVEL_PRIORITY.indexOf(incoming)
  if (currentPriority === -1) return incoming
  if (incomingPriority === -1) return current
  return currentPriority <= incomingPriority ? current : incoming
}

/**
 * featureUsage のマージ
 * - usage: AccessLevel の優先順位に基づいてフィールドごとにマージ
 * - components: 変更しない（廃止予定）
 * - gameScripts: Set で重複除去してマージ
 * - developer: current を維持（incoming を無視）
 */
const mergeFeatureUsage = (
  current: OmikujiDataType['featureUsage'],
  incoming: OmikujiDataType['featureUsage']
): OmikujiDataType['featureUsage'] => {
  // current と incoming 両方のキーを union して処理
  const allKeys = Object.keys({ ...current.usage, ...incoming.usage }) as (keyof FlagsUsageType)[]

  const mergedUsage = allKeys.reduce((acc, key) => {
    const currentVal = (current.usage[key] ?? 'none') as AccessLevelType
    const incomingVal = (incoming.usage[key] ?? 'none') as AccessLevelType
    acc[key] = mergeAccessLevel(currentVal, incomingVal)
    return acc
  }, {} as FlagsUsageType)

  const mergedGameScripts = [...new Set([...current.gameScripts, ...incoming.gameScripts])]

  return {
    ...current,
    usage: mergedUsage,
    gameScripts: mergedGameScripts,
    developer: current.developer,
  }
}

/**
 * JsonMerge:複数のOmikujiDataを統合
 */
export function mergeOmikujiData(...dataArray: OmikujiDataType[]): OmikujiDataType {
  const result: OmikujiDataType = {} as OmikujiDataType

  for (const data of dataArray) {
    // Rulesカテゴリを網羅マージ
    for (const category of eventCategoryLabel) {
      mergeRecordCategory(result, data, category)
    }
    // Record型をマージ
    result.actionSets = { ...result.actionSets, ...data.actionSets }
    result.placeholders = { ...result.placeholders, ...data.placeholders }

    // characters は上書き
    result.characters = data.characters

    // 設定系: 上書き（最後のデータで統一）
    result.components = data.components
    result.featureUsage = result.featureUsage
      ? mergeFeatureUsage(result.featureUsage, data.featureUsage)
      : data.featureUsage
    result.settings = data.settings
    result.meta = data.meta

    // jsonMerge: 存在する場合のみセット（通常は最後は空配列）
    if (data.jsonMerge) result.jsonMerge = data.jsonMerge
  }

  return result
}

function mergeRecordCategory<K extends EventCategoryType>(
  target: OmikujiDataType,
  source: OmikujiDataType,
  category: K
) {
  target[category] = {
    ...target[category],
    ...source[category],
  }
}
