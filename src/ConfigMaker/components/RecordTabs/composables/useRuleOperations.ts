// src/configMaker/components/RecordTabs/composables/useRuleOperations.ts
import { RecordCategoryType, RecordCategoryItemTypeMap } from '@/types/OmikujiData/CategoryType'
import type { useRuleState } from './useRuleState'
import { useOmikujiStore } from '@/ConfigMaker/stores/useOmikujiStore'
import { BaseRecordType } from '@shared/types'
import Swal from 'sweetalert2'

export const useRuleOperations = (ruleState: ReturnType<typeof useRuleState>) => {
  const omikujiStore = useOmikujiStore()
  const { validCategory, categoryArray, filterOptions } = ruleState

  const withValidCategory = <T>(callback: (category: RecordCategoryType) => T): T | void => {
    const category = validCategory.value
    if (!category) {
      console.error('Invalid category:', category)
      return
    }
    return callback(category)
  }

  // 新しいルールを追加
  const handleAddItem = () => {
    withValidCategory((category) => {
      const editorColor = filterOptions.value.colorFilter || undefined
      const newId = omikujiStore.addItem?.(category, { editorColor })
      omikujiStore.selectItem(newId)

      Swal.fire({
        toast: true,
        position: 'bottom-end',
        icon: 'success',
        title: '新しいルールを追加しました',
        text: 'ルールの設定を行ってください',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      })
    })
  }

  // ルールの内容を更新
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

  // ルール削除（確認ダイアログ）
  const handleDeleteRule = (ruleId: string, ruleName?: string) => {
    withValidCategory(async (category) => {
      const name = ruleName || '名前未設定'

      const result = await Swal.fire({
        icon: 'warning',
        title: `「${name}」を削除しますか？`,
        text: 'この操作は取り消せません',
        showCancelButton: true,
        confirmButtonText: '削除する',
        cancelButtonText: 'キャンセル',
      })

      if (!result.isConfirmed) return

      omikujiStore.removeItem(category, ruleId)

      Swal.fire({
        toast: true,
        position: 'bottom-end',
        icon: 'success',
        title: 'ルールを削除しました',
        text: `「${name}」を削除しました`,
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      })
    })
  }

  // ルール複製
  const handleDuplicateRule = (ruleId: string) => {
    withValidCategory((category) => {
      omikujiStore.duplicateItem(category, ruleId)

      Swal.fire({
        toast: true,
        position: 'bottom-end',
        icon: 'success',
        title: 'ルールを複製しました',
        text: 'コピーを作成しました',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      })
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
