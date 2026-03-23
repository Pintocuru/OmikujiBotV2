// src/ConfigMaker/stores/composables/useDataMerge.ts
import { Ref } from 'vue'
import { RecordCategoryType, recordCategoryLabel } from '@/types/OmikujiData/'
import { OmikujiDataType } from '@/types/OmikujiData/OmikujiDataSchema'
import { FlagsDeveloperSchema, FlagsUsageType } from '@/types/OmikujiData/FlagsSchema'
import { UiSettingsType } from '@/types/OmikujiData/UiSchema'
import { useDataMergeHelpers } from './useDataMergeHelpers'
import { ImportPreview } from '@config/components/presetsImport/ImportTypes'
import { normalizeData } from '@/common/migrations'
import { swalModal, swalToast } from '@/common/SweetAlert2/SweetAlert2Toast'
import { AccessLevelType } from '@shared/types'

/**
 * データマージ機能
 */
export function useDataMerge(data: Ref<OmikujiDataType>, hasChanged: Ref<boolean>) {
  const helpers = useDataMergeHelpers()

  /**
   * インポートされたデータを既存データにマージ
   * インポートデータにもマイグレーションを適用
   */
  const mergeDataSets = (importedRawData: unknown, preview: ImportPreview): boolean => {
    try {
      // インポートデータにマイグレーション&バリデーションを適用
      const importedData = normalizeData(importedRawData)

      let result: OmikujiDataType

      // 部分更新モード
      result = processPartialMerge(importedData, preview)

      // 成功トースト
      swalToast.success({ title: 'データの部分更新が完了しました。' })

      data.value = result
      hasChanged.value = true
      return true
    } catch (error) {
      swalModal.error({
        title: 'データの更新中にエラーが発生しました',
        text: String(error),
      })
      console.error('Merge error:', error)
      return false
    }
  }

  /**
   * 部分マージ処理
   */
  const processPartialMerge = (importedData: OmikujiDataType, preview: ImportPreview): OmikujiDataType => {
    const result: OmikujiDataType = { ...data.value }

    // Record型カテゴリのみ処理
    recordCategoryLabel.forEach(<K extends RecordCategoryType>(category: K) => {
      const config = preview.recordCategories[category]
      if (!config?.enabled) return

      const currentItems = result[category]
      const importItems = importedData[category]

      // partial-mergeの場合はorder値を調整
      let adjustedImportItems = importItems
      if (config.mode === 'partial-merge') {
        const maxOrder = helpers.getMaxOrder(currentItems)
        adjustedImportItems = helpers.adjustOrderValues(importItems, maxOrder)
      }

      // マージ実行
      const mergedItems = helpers.mergeCategoryData(currentItems, adjustedImportItems, config.mode)
      result[category] = mergedItems as OmikujiDataType[typeof category]
    })

    // featureUsage のマージ
    result.featureUsage = mergeFeatureUsage(result.featureUsage, importedData.featureUsage)

    // components（UiSchema）の settings のみマージ
    result.components = mergeComponents(result.components, importedData.components, preview)

    return result
  }

  /**
   * featureUsage のマージ
   * - usage: AccessLevel の優先順位に基づいてフィールドごとにマージ
   * - components: 変更しない（廃止予定）
   * - gameScripts: Set で重複除去してマージ
   * - developer: すべて basic に固定（マージ制限を排除するため）
   */
  const mergeFeatureUsage = (
    current: OmikujiDataType['featureUsage'],
    incoming: OmikujiDataType['featureUsage']
  ): OmikujiDataType['featureUsage'] => {
    // usage: フィールドごとに AccessLevel の優先順位でマージ
    const mergedUsage = (Object.keys(current.usage) as (keyof FlagsUsageType)[]).reduce((acc, key) => {
      acc[key] = helpers.mergeAccessLevel(current.usage[key] as AccessLevelType, incoming.usage[key] as AccessLevelType)
      return acc
    }, {} as FlagsUsageType)

    // gameScripts: 重複除去マージ
    const mergedGameScripts = [...new Set([...current.gameScripts, ...incoming.gameScripts])]

    // developer: すべて basic に固定
    const developerBasic = FlagsDeveloperSchema.parse({})

    return {
      ...current,
      usage: mergedUsage,
      // components は変更しない
      gameScripts: mergedGameScripts,
      developer: developerBasic,
    }
  }

  /**
   * components（UiSchema）のマージ
   * - conditions / enableSecondary / specialSet / commonStyle は変更しない
   * - settings: preview.componentConfigs を参照し、
   *   enabled && useImported のキーのみ incoming で上書き（shallow merge）
   *   それ以外（設定なし・enabled=false・useImported=false）は current を維持
   */
  const mergeComponents = (
    current: OmikujiDataType['components'],
    incoming: OmikujiDataType['components'],
    preview: ImportPreview
  ): OmikujiDataType['components'] => {
    const mergedSettings = (Object.keys(incoming.settings ?? {}) as (keyof UiSettingsType)[]).reduce(
      (acc, key) => {
        const config = preview.componentConfigs[key as keyof typeof preview.componentConfigs]
        // enabled && useImported のときのみ incoming で上書き、それ以外は current を維持
        if (config?.enabled && config.useImported) {
          const incomingValue = incoming.settings?.[key]
          if (incomingValue !== undefined) {
            acc[key] = { ...(current.settings?.[key] ?? {}), ...incomingValue } as any
          }
        }
        return acc
      },
      { ...(current.settings ?? {}) } as UiSettingsType
    )

    return {
      // conditions / enableSecondary / specialSet / commonStyle は current のまま
      conditions: current.conditions,
      enableSecondary: current.enableSecondary,
      specialSet: current.specialSet,
      commonStyle: current.commonStyle,
      settings: mergedSettings,
    }
  }

  return {
    mergeDataSets,
  }
}
