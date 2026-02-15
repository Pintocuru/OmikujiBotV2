// tools/JsonMerge/merger.ts
import { OmikujiDataType, rulesCategoryLabel, RulesCategoryType } from '@/types/OmikujiData/'

/**
 * JsonMerge:複数のOmikujiDataを統合
 */
export function mergeOmikujiData(...dataArray: OmikujiDataType[]): OmikujiDataType {
  const result: OmikujiDataType = {} as OmikujiDataType

  for (const data of dataArray) {
    // Rulesカテゴリを網羅マージ
    for (const category of rulesCategoryLabel) {
      mergeRecordCategory(result, data, category)
    }
    // Record型をマージ
    result.actionSets = { ...result.actionSets, ...data.actionSets }
    result.placeholders = { ...result.placeholders, ...data.placeholders }

    // characters は上書き
    result.characters = data.characters

    // 設定系: 上書き（最後のデータで統一）
    result.components = data.components
    result.featureUsage = data.featureUsage
    result.settings = data.settings
    result.meta = data.meta

    // jsonMerge: 存在する場合のみセット（通常は最後は空配列）
    if (data.jsonMerge) result.jsonMerge = data.jsonMerge
  }

  return result
}

function mergeRecordCategory<K extends RulesCategoryType>(
  target: OmikujiDataType,
  source: OmikujiDataType,
  category: K
) {
  target[category] = {
    ...target[category],
    ...source[category],
  }
}
