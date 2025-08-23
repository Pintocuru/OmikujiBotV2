// src/ConfigMaker/script/stores/composables/useDataOperations.ts (更新版)
import { Ref } from 'vue'
import {
  CategoryType,
  RecordCategoryType,
  RecordCategoryTypeMap,
  RecordCategoryUnion,
} from '@/types/OmikujiData/CategoryType'
import { OmikujiDataSchema, OmikujiDataType } from '@/types/OmikujiData/OmikujiDataSchema'
import { ImportPreview, ImportMode } from '@/ConfigMaker/components/presetsImport/ImportTypes'
import { toast } from 'vue-sonner'

/**
 * データの読み込み、保存、マージ機能を提供するコンポーザブル
 */
export function useDataOperations(data: Ref<OmikujiDataType>) {
  /**
   * データを読み込み、バリデーションを行う
   */
  const loadData = (loadData: unknown): boolean => {
    try {
      const parsed = OmikujiDataSchema.safeParse(loadData)
      if (parsed.success) {
        data.value = parsed.data
        toast.success('データを正常に読み込みました。')
        return true
      } else {
        toast.error('データの形式が正しくありません。')
        console.error('Validation errors:', parsed.error)
        return false
      }
    } catch (error) {
      toast.error('データの読み込み中にエラーが発生しました。')
      console.error('Load data error:', error)
      return false
    }
  }

  /**
   * 現在のデータをバリデーション
   */
  const validateData = () => {
    return OmikujiDataSchema.safeParse(data.value)
  }

  /**
   * データをJSON形式でエクスポート
   */
  const exportData = () => {
    const validation = validateData()
    if (validation.success) {
      return JSON.stringify(data.value, null, 2)
    }
    throw new Error('データの検証に失敗しました。')
  }

  /**
   * インポートされたデータを既存データにマージ
   */
  const mergeDataSets = (importedData: OmikujiDataType, preview: ImportPreview): boolean => {
    try {
      let result: OmikujiDataType

      if (preview.importMode === 'full') {
        // 全体上書きモード - 単純にインポートデータを使用
        result = { ...importedData }
        toast.success('データの上書きが完了しました。')
      } else {
        // 部分更新モード
        // TODO: orderの数値が既存のデータと被るため、
        // 必ず既存の orderよりも高い数値をあらかじめ入れること。
        result = { ...data.value }

        // Record型カテゴリのみ処理
        Object.entries(preview.recordCategories).forEach(([categoryKey, config]) => {
          if (!config.enabled) return

          const category = categoryKey as RecordCategoryType
          const currentItems = result[category]
          const importItems = importedData[category]
          /**
           * 型 'Record<string, { ruleType: "comments"; threshold: { conditions: ("comment" | "syoken" | "access" | "gift" | "count")[]; syoken: ("syoken" | "again" | "firstVisit")[]; access: ("basic" | "member" | "subscriber" | "premium" | "moderator" | "owner")[]; gift: ("all" | ... 7 more ... | "purple")[]; count: { ...; }; comme...' の引数を型 '{ ruleType: "comments"; threshold: { conditions: ("comment" | "syoken" | "access" | "gift" | "count")[]; syoken: ("syoken" | "again" | "firstVisit")[]; access: ("basic" | "member" | "subscriber" | "premium" | "moderator" | "owner")[]; gift: ("all" | ... 7 more ... | "purple")[]; count: { ...; }; comment: string[]; }...' のパラメーターに割り当てることはできません。
  型 'Record<string, { ruleType: "comments"; threshold: { conditions: ("comment" | "syoken" | "access" | "gift" | "count")[]; syoken: ("syoken" | "again" | "firstVisit")[]; access: ("basic" | "member" | "subscriber" | "premium" | "moderator" | "owner")[]; gift: ("all" | ... 7 more ... | "purple")[]; count: { ...; }; comme...' を型 '{ ruleType: "comments"; threshold: { conditions: ("comment" | "syoken" | "access" | "gift" | "count")[]; syoken: ("syoken" | "again" | "firstVisit")[]; access: ("basic" | "member" | "subscriber" | "premium" | "moderator" | "owner")[]; gift: ("all" | ... 7 more ... | "purple")[]; count: { ...; }; comment: string[]; }...' に割り当てることはできません。
    型 'Record<string, { ruleType: "comments"; threshold: { conditions: ("comment" | "syoken" | "access" | "gift" | "count")[]; syoken: ("syoken" | "again" | "firstVisit")[]; access: ("basic" | "member" | "subscriber" | "premium" | "moderator" | "owner")[]; gift: ("all" | ... 7 more ... | "purple")[]; count: { ...; }; comme...' には 型 '{ displayName: string; displayOption: { isIconDisplay: boolean; isOneCommePost: boolean; isVoice: boolean; }; color: { nameColor: string; textColor: string; backgroundColor: string; customClasses?: string | undefined; }; ... 17 more ...; description?: string | undefined; }' からの次のプロパティがありません: displayName, displayOption, color, version、7 など。ts(2345)
const currentItems: Record<string, {
    ruleType: "comments";
    threshold: {
        conditions: ("comment" | "syoken" | "access" | "gift" | "count")[];
        syoken: ("syoken" | "again" | "firstVisit")[];
        access: ("basic" | "member" | "subscriber" | "premium" | "moderator" | "owner")[];
        gift: ("all" | "blue" | "lightBlue" | "green" | "yellow" | "orange" | "pink" | "red" | "purple")[];
        count: {
            comparison: "lowerBound" | "upperBound" | "equal" | "loop";
            unit: "lc" | "tc";
            value: number;
        };
        comment: string[];
    };
    scriptId: string | null;
    scriptParams: Record<string, any> | null;
    limits: {
        cooldownSeconds: number;
        ... 5 more ...;
        repeatMessage?: string | undefined;
    };
    ... 11 more ...;
    description?: string | undefined;
}> | Record<...> | Record<...> | Record<...>
           */
          const mergedItems = mergeCategoryData(currentItems, importItems, config.mode)
          result[category] = mergedItems
        })

        // Object型カテゴリは変更しない（既存データを保持）
        toast.success('データの部分更新が完了しました。')
      }

      data.value = result
      return true
    } catch (error) {
      toast.error('データの更新中にエラーが発生しました。')
      console.error('Merge error:', error)
      return false
    }
  }

  /**
   * カテゴリごとのデータマージ処理
   */
  const mergeCategoryData = <C extends RecordCategoryType>(
    currentItems: RecordCategoryTypeMap[C],
    importItems: RecordCategoryTypeMap[C],
    mode: ImportMode
  ): RecordCategoryTypeMap[C] => {
    switch (mode) {
      case 'full-replace':
        // 全体上書き（全データ置き換え）
        return importItems

      case 'partial-replace':
        // 部分置き換え（カテゴリ内の既存データを削除して新しいデータのみ）
        return importItems

      case 'partial-merge':
        // 部分マージ（同じIDがある場合はJSONデータを優先）
        if (typeof currentItems === 'object' && typeof importItems === 'object') {
          return { ...currentItems, ...importItems }
        }
        return importItems

      default:
        return currentItems
    }
  }

  return {
    loadData,
    validateData,
    exportData,
    mergeDataSets,
  }
}
