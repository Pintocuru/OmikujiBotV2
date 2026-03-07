// src/ConfigMaker/components/RecordTabs/composables/useRuleOperations.ts
import { RecordCategoryType, RecordCategoryItemTypeMap } from '@/types/OmikujiData/'
import type { useRuleState } from './useRuleState'
import { useOmikujiStore } from '@config/stores/useOmikujiStore'
import { BaseRecordType } from '@shared/types'
import { useNavigationStore } from '@config/stores/useNavigationStore'
import { swalModal, swalToast } from '@/common/SweetAlert2/SweetAlert2Toast'

export const useRuleOperations = (ruleState: ReturnType<typeof useRuleState>) => {
  const omikujiStore = useOmikujiStore()
  const { selectItem } = useNavigationStore()
  const { validCategory, categoryArray, filterOptions } = ruleState

  const withValidCategory = <T>(callback: (category: RecordCategoryType) => T): T | void => {
    const category = validCategory.value
    if (!category) {
      console.error('Invalid category:', category)
      return
    }
    return callback(category)
  }

  // 新しいイベントを追加
  const handleAddItem = () => {
    withValidCategory((category) => {
      const editorColor = filterOptions.value.colorFilter || undefined
      const newId = omikujiStore.addItem?.(category, { editorColor })
      selectItem(newId)
      swalToast.success({ title: '新しいイベントを追加しました' })
    })
  }

  // イベントの内容を更新
  const handleUpdateRule = <C extends RecordCategoryType>(
    ruleId: string,
    updates: Partial<RecordCategoryItemTypeMap[C]>
  ) => {
    return withValidCategory((category) => {
      omikujiStore.updateItem(category, ruleId, updates)

      // UI 側で通知したい情報だけ返す
      return {
        updatedName: updates.name,
      }
    })
  }

  // イベント削除（確認ダイアログ）
  const handleDeleteRule = (ruleId: string, ruleName?: string) => {
    withValidCategory(async (category) => {
      const name = ruleName || '名前未設定'

      const result = await swalModal.confirmDelete({
        title: `「${name}」を削除しますか？`,
      })

      if (!result.isConfirmed) return
      omikujiStore.removeItem(category, ruleId)
      swalToast.success({ title: `「${name}」を削除しました` })
    })
  }

  // イベント複製
  const handleDuplicateRule = (ruleId: string) => {
    withValidCategory((category) => {
      omikujiStore.duplicateItem(category, ruleId)
      swalToast.success({ title: 'イベントを複製しました' })
    })
  }

  // 上に移動
  const handleMoveRuleUp = (currentIndex: number) => {
    withValidCategory((category) => {
      if (currentIndex > 0) {
        omikujiStore.reorderItem(category, currentIndex, currentIndex - 1)
      }
    })
  }

  // 下に移動
  const handleMoveRuleDown = (currentIndex: number, totalLength: number) => {
    withValidCategory((category) => {
      if (currentIndex < totalLength - 1) {
        omikujiStore.reorderItem(category, currentIndex, currentIndex + 1)
      }
    })
  }

  // インデックス取得
  const getRuleIndex = (ruleKey: string): number => {
    if (!categoryArray.value || !validCategory.value) {
      console.error('Invalid category:', validCategory.value)
      return 0
    }
    return categoryArray.value.findIndex((rule: BaseRecordType) => rule.key === ruleKey)
  }

  return {
    handleAddItem,
    handleUpdateRule,
    handleDuplicateRule,
    handleDeleteRule,
    handleMoveRuleUp,
    handleMoveRuleDown,
    getRuleIndex,
  }
}
