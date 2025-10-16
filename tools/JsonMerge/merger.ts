// tools/JsonMerge/merger.ts
import type { OmikujiDataType } from '@/types/OmikujiData/OmikujiDataSchema'

/**
 * 複数のOmikujiDataを統合
 *
 * Record型プロパティ（comments, timers, actionSets, placeholders）は
 * キーごとにマージされます
 * その他のプロパティ（characters, settings系）は後ろの要素で上書きされます
 *
 * @param dataArray - マージするOmikujiDataの可変長配列
 * @returns マージ後の単一のOmikujiData
 */
export function mergeOmikujiData(...dataArray: OmikujiDataType[]): OmikujiDataType {
  const result: OmikujiDataType = {} as OmikujiDataType

  for (const data of dataArray) {
    // Record型プロパティ: キーをマージ（後ろの同一キーで上書き）
    result.comments = { ...result.comments, ...data.comments }
    result.timers = { ...result.timers, ...data.timers }
    result.actionSets = { ...result.actionSets, ...data.actionSets }
    result.placeholders = { ...result.placeholders, ...data.placeholders }

    // characters: 上書き（複数マージの場合、最後のcharactersで統一）
    result.characters = data.characters

    // 設定系: 上書き（最後のデータで統一）
    result.wordPartySettings = data.wordPartySettings
    result.meta = data.meta
    result.scriptSettings = data.scriptSettings
    result.displaySettings = data.displaySettings

    // jsonMerge: 存在する場合のみセット（通常は最後は空配列）
    if (data.jsonMerge) {
      result.jsonMerge = data.jsonMerge
    }
  }

  return result
}
