// src/configMaker/components/presets/useImportPreviewManager.ts (効率化版)
// ! 使わないかも
import { ref, computed } from 'vue'
import { CategoryType, recordCategoryLabel, RecordCategoryType } from '@/types/OmikujiData/CategoryType'
import { OmikujiDataSchema, OmikujiDataType } from '@/types/OmikujiData/OmikujiDataSchema'
import { CategoryImportConfig, ConflictInfo, ImportPreview } from './ImportTypes'

/**
 * インポートプレビューの生成と管理を担当するComposable
 */
export const useImportPreviewManager = () => {
  const previewData = ref<ImportPreview | null>(null)
  const globalImportMode = ref<'full' | 'partial'>('partial')

  // アイテムから名前を取得するヘルパー関数
  const getItemName = (item: any): string => {
    if (item && typeof item === 'object' && 'name' in item) {
      return item.name || ''
    }
    return ''
  }

  // Record型カテゴリの競合チェック
  const checkRecordConflicts = (
    currentData: OmikujiDataType,
    importedData: OmikujiDataType,
    category: CategoryType
  ): ConflictInfo[] => {
    const currentItems = currentData[category] ?? {}
    const importItems = importedData[category] ?? {}

    if (typeof currentItems !== 'object' || typeof importItems !== 'object') {
      return []
    }

    const importKeys = Object.keys(importItems)
    const currentKeys = Object.keys(currentItems)
    const conflictKeys = importKeys.filter((key) => currentKeys.includes(key))

    return conflictKeys.map((key) => ({
      key,
      /**
       * 型 'string' の式を使用して型 '{ id: string; name: string; description: string; version: string; generatorName: string; generatorVersion: string; author: string; tags: string[]; license: string; url?: string | undefined; } | Record<...> | ... 5 more ... | { ...; }[]' にインデックスを付けることはできないため、要素は暗黙的に 'any' 型になります。
  型 'string' のパラメーターを持つインデックス シグネチャが型 '{ id: string; name: string; description: string; version: string; generatorName: string; generatorVersion: string; author: string; tags: string[]; license: string; url?: string | undefined; } | Record<...> | ... 5 more ... | { ...; }[]' に見つかりませんでした。ts(7053)
const importItems: {
    id: string;
    name: string;
    description: string;
    version: string;
    generatorName: string;
    generatorVersion: string;
    author: string;
    tags: string[];
    license: string;
    url?: string | undefined;
} | Record<string, {
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
    ... 14 more ...;
    description?: string | undefined;
}> | ... 5 more ... | {
    ...;
}[]
       */
      // @ts-ignore 使わないので
      name: getItemName(importItems[key]),
    }))
  }

  // プレビュー生成
  const buildPreview = (currentData: OmikujiDataType, importedData: OmikujiDataType): ImportPreview => {
    const validatedImportData = OmikujiDataSchema.parse(importedData)

    const recordCategories: Record<CategoryType, CategoryImportConfig> = {} as any
    let totalItems = 0

    // Record型カテゴリのみ処理
    recordCategoryLabel.forEach((category) => {
      const importItems = validatedImportData[category] ?? {}
      const importCount = Object.keys(importItems).length
      const conflicts = checkRecordConflicts(currentData, validatedImportData, category)

      totalItems += importCount

      const isPartialTarget = recordCategoryLabel.includes(category)

      recordCategories[category] = {
        enabled: globalImportMode.value === 'full' ? true : isPartialTarget,
        mode: globalImportMode.value === 'full' ? 'full-replace' : 'partial-merge',
        count: importCount,
        conflicts,
      }
    })

    return {
      recordCategories,
      totalItems,
      importMode: globalImportMode.value,
    }
  }

  // プレビュー生成
  const generatePreview = (currentData: OmikujiDataType, importedData: OmikujiDataType): ImportPreview => {
    const preview = buildPreview(currentData, importedData)
    previewData.value = preview
    return preview
  }

  // 全体インポートモードの変更
  const setGlobalImportMode = (mode: 'full' | 'partial') => {
    globalImportMode.value = mode

    if (previewData.value) {
      // モード変更時に各カテゴリの設定を更新
      Object.keys(previewData.value.recordCategories).forEach((categoryKey) => {
        const category = categoryKey as RecordCategoryType
        const config = previewData.value!.recordCategories[category]
        const isPartialTarget = recordCategoryLabel.includes(category)

        if (mode === 'full') {
          config.enabled = true
          config.mode = 'full-replace'
        } else {
          config.enabled = isPartialTarget
          config.mode = isPartialTarget ? 'partial-merge' : 'partial-replace'
        }
      })

      previewData.value.importMode = mode
    }
  }

  // カテゴリ設定の更新
  const updateCategorySettings = (category: RecordCategoryType, config: Partial<CategoryImportConfig>) => {
    if (!previewData.value || !previewData.value.recordCategories[category]) return

    previewData.value.recordCategories[category] = {
      ...previewData.value.recordCategories[category],
      ...config,
    }
  }

  // プレビューをクリア
  const clearPreview = () => {
    previewData.value = null
  }

  // 計算されたプロパティ
  const hasPreviewData = computed(() => !!previewData.value)
  const enabledCategories = computed(() => {
    if (!previewData.value) return []
    return Object.entries(previewData.value.recordCategories)
      .filter(([, config]) => config.enabled)
      .map(([category]) => category as CategoryType)
  })

  return {
    // State
    previewData,
    globalImportMode,

    // Computed
    hasPreviewData,
    enabledCategories,

    // Actions
    generatePreview,
    updateCategorySettings,
    setGlobalImportMode,
    clearPreview,
  }
}
