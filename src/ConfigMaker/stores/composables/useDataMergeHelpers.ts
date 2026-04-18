// src/ConfigMaker/stores/composables/useDataMergeHelpers.ts
import { RecordCategoryDataMap, RecordCategoryType } from '@/types/OmikujiData/'
import { ImportMode } from '@config/components/presetsImport/ImportTypes'
import { AccessLevelType } from '@shared/types'

// basic > adv > pro > godMode > none の順（インデックスが小さいほど優先度が高い）
export const ACCESS_LEVEL_PRIORITY: AccessLevelType[] = ['basic', 'adv', 'pro', 'godMode', 'none']

/**
 * データマージ処理のヘルパー関数を提供
 */
export function useDataMergeHelpers() {
  /**
   * BaseRecordSchemaを含むアイテムかどうかを判定
   */
  const hasOrderProperty = (item: any): item is { order: number } => {
    return item && typeof item === 'object' && 'order' in item && typeof item.order === 'number'
  }

  /**
   * 指定されたカテゴリの最大order値を取得
   */
  const getMaxOrder = (categoryData: Record<string, any>): number => {
    if (!categoryData || typeof categoryData !== 'object') {
      return 0
    }

    const orders = Object.values(categoryData)
      .filter(hasOrderProperty)
      .map((item) => item.order)

    return orders.length > 0 ? Math.max(...orders) : 0
  }

  /**
   * インポートデータのorder値を調整
   * 既存の最大order値を基準に連番を振り直す
   */
  const adjustOrderValues = <T extends Record<string, any>>(importItems: T, baseOrder: number): T => {
    if (!importItems || typeof importItems !== 'object') {
      return importItems
    }

    const result = {} as T
    let currentOffset = 0

    Object.entries(importItems).forEach(([key, item]) => {
      if (hasOrderProperty(item)) {
        result[key as keyof T] = {
          ...item,
          order: baseOrder + currentOffset + 1,
        } as T[keyof T]
        currentOffset++
      } else {
        result[key as keyof T] = item
      }
    })

    return result
  }

  /**
   * カテゴリごとのデータマージ処理
   */
  const mergeCategoryData = <C extends RecordCategoryType>(
    currentItems: RecordCategoryDataMap[C],
    importItems: RecordCategoryDataMap[C],
    mode: ImportMode
  ): RecordCategoryDataMap[C] => {
    switch (mode) {
      case 'full-replace':
        // 全体上書き（全データ置き換え）
        return importItems

      case 'partial-replace':
        // 部分置き換え（カテゴリ内の既存データを削除して新しいデータのみ）
        return importItems

      case 'partial-merge':
        // 部分マージ（同じkeyがある場合はJSONデータを優先）
        return { ...currentItems, ...importItems }

      default:
        return currentItems
    }
  }

  /**
   * AccessLevel を優先順位に基づいてマージする
   * basic > adv > pro > godMode > none の順で優先度が高い
   * 例：元が none でマージ先が basic → basic
   *     元が basic でマージ先が none → basic（変わらない）
   */
  const mergeAccessLevel = (current: AccessLevelType, incoming: AccessLevelType): AccessLevelType => {
    const currentPriority = ACCESS_LEVEL_PRIORITY.indexOf(current)
    const incomingPriority = ACCESS_LEVEL_PRIORITY.indexOf(incoming)

    // インデックスが小さい（優先度が高い）方を採用
    // indexOf が -1（未知の値）の場合は相手を優先
    if (currentPriority === -1) return incoming
    if (incomingPriority === -1) return current
    return currentPriority <= incomingPriority ? current : incoming
  }

  return {
    hasOrderProperty,
    getMaxOrder,
    adjustOrderValues,
    mergeCategoryData,
    mergeAccessLevel,
  }
}
