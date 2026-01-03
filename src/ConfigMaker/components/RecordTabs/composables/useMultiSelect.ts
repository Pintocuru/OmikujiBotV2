// src/configMaker/components/RecordTabs/composables/useMultiSelect.ts
import { ref, watch } from 'vue'
import { useOmikujiStore } from '@config/stores/useOmikujiStore'
import { RecordCategoryType } from '@/types/OmikujiData/CategoryType'
import type { useRuleState } from './useRuleState'
import { BaseRecordType, AccessLevelType } from '@shared/types'
import { storeToRefs } from 'pinia'
import { toast } from 'vue-sonner'
import Swal from 'sweetalert2'

/**
 * マルチセレクト機能の管理
 * Ctrl/Cmd + クリック、Shift + クリック、範囲選択、一括削除を提供
 */
export const useMultiSelect = (ruleState: ReturnType<typeof useRuleState>) => {
  const omikujiStore = useOmikujiStore()
  const { selectedCategory } = storeToRefs(omikujiStore)
  const { validCategory, filteredSortedItems, isMultiSelectMode } = ruleState

  const selectedRuleIds = ref(new Set<string>())

  // マルチセレクトモードの切り替え
  const toggleMultiSelectMode = (state?: boolean) => {
    if (typeof state === 'boolean') isMultiSelectMode.value = state
    else isMultiSelectMode.value = !isMultiSelectMode.value

    if (!isMultiSelectMode.value) selectedRuleIds.value.clear()
  }

  // selectedCategory を監視して変化したら isMultiSelectMode をfalse
  watch(selectedCategory, () => {
    isMultiSelectMode.value = false
  })

  // マルチセレクト処理（Ctrl、Shift、通常クリック対応）
  const handleMultiSelect = (ruleId: string, event: MouseEvent) => {
    if (!isMultiSelectMode.value) return

    event.preventDefault()
    event.stopPropagation()

    if (event.ctrlKey || event.metaKey) {
      // Ctrl/Cmd クリック: 個別の選択/解除
      if (selectedRuleIds.value.has(ruleId)) {
        selectedRuleIds.value.delete(ruleId)
      } else {
        selectedRuleIds.value.add(ruleId)
      }
    } else if (event.shiftKey && selectedRuleIds.value.size > 0) {
      // Shift クリック: 範囲選択
      handleRangeSelect(ruleId)
    } else {
      // 通常のクリック: 単一選択
      if (selectedRuleIds.value.has(ruleId)) {
        selectedRuleIds.value.delete(ruleId)
      } else {
        selectedRuleIds.value.add(ruleId)
      }
    }
  }

  /** 範囲選択の処理 */
  const handleRangeSelect = (ruleKey: string) => {
    const currentRules = filteredSortedItems.value
    const lastSelectedIndex = Math.max(
      ...Array.from(selectedRuleIds.value).map((key) =>
        currentRules.findIndex((rule: BaseRecordType) => rule.key === key)
      )
    )
    const clickedIndex = currentRules.findIndex((rule: BaseRecordType) => rule.key === ruleKey)

    const start = Math.min(lastSelectedIndex, clickedIndex)
    const end = Math.max(lastSelectedIndex, clickedIndex)

    for (let i = start; i <= end; i++) {
      if (currentRules[i]) {
        selectedRuleIds.value.add(currentRules[i].key)
      }
    }
  }

  /** 全選択 */
  const selectAll = () => {
    filteredSortedItems.value.forEach((rule: BaseRecordType) => {
      selectedRuleIds.value.add(rule.key)
    })
  }

  /** 選択解除 */
  const clearSelection = () => {
    selectedRuleIds.value.clear()
    isMultiSelectMode.value = false
  }

  /** 選択されたルールを取得 */
  const getSelectedRules = (): BaseRecordType[] => {
    return Array.from(selectedRuleIds.value)
      .map((key) => filteredSortedItems.value.find((rule: BaseRecordType) => rule.key === key))
      .filter(Boolean) as BaseRecordType[]
  }

  /** 一括削除の実行 */
  const handleBulkDelete = async () => {
    if (selectedRuleIds.value.size === 0) return

    const category = validCategory.value as RecordCategoryType
    const rulesToDelete = getSelectedRules()
    const count = rulesToDelete.length

    // SweetAlert2 で確認ダイアログを出す（この方が非同期制御が確実です）
    const result = await Swal.fire({
      title: `${count}件のルールを削除しますか？`,
      text: 'この操作は取り消せません',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: '削除する',
      cancelButtonText: 'キャンセル',
      // コンテキストメニューより前面に出すための設定
      target: 'body',
    })

    if (result.isConfirmed) {
      // 1. 削除実行（デバッグで成功したロジックをそのまま使用）
      rulesToDelete.forEach((rule) => {
        omikujiStore.removeItem(category, rule.key)
      })

      // 2. 状態クリア
      selectedRuleIds.value.clear()
      isMultiSelectMode.value = false

      // 3. 完了通知
      Swal.fire({
        toast: true,
        position: 'bottom-end',
        icon: 'success',
        title: `${count}件のルールを削除しました`,
        showConfirmButton: false,
        timer: 2000,
      })
    }
  }

  // 一括有効/無効切り替え
  const handleBulkToggleEnabled = (enabled: boolean) => {
    if (selectedRuleIds.value.size === 0) return

    const selectedRules = getSelectedRules()
    const category = validCategory.value as RecordCategoryType

    selectedRules.forEach((rule) => {
      omikujiStore.updateItem(category, rule.key, {
        ...rule,
        isEnabled: enabled,
      })
    })

    return {
      count: selectedRules.length,
      action: enabled ? '有効' : '無効',
    }
  }

  // 一括アクセスレベル変更
  const handleBulkAccessLevelChange = (accessLevel: AccessLevelType) => {
    if (selectedRuleIds.value.size === 0) return null

    const selectedRules = getSelectedRules()
    const category = validCategory.value as RecordCategoryType

    selectedRules.forEach((rule) => {
      omikujiStore.updateItem(category, rule.key, {
        ...rule,
        accessLevel,
      })
    })

    return {
      count: selectedRules.length,
      accessLevel,
    }
  }

  /** 一括カラー設定 */
  const handleBulkColorChange = (color: string) => {
    if (selectedRuleIds.value.size === 0) return

    const selectedRules = getSelectedRules()
    const category = validCategory.value as RecordCategoryType

    selectedRules.forEach((rule) => {
      omikujiStore.updateItem(category, rule.key, {
        ...rule,
        editorColor: color,
      })
    })

    const count = selectedRules.length
    toast.success(`${count}件のルールのカラーを変更しました`, {
      description: '一括カラー変更が完了しました',
      duration: 3000,
    })
  }

  /** 一括複製 */
  const handleBulkDuplicate = () => {
    if (selectedRuleIds.value.size === 0) return

    const selectedRules = getSelectedRules()
    const category = validCategory.value as RecordCategoryType

    // 選択を解除してから複製実行
    selectedRuleIds.value.clear()

    selectedRules.forEach((rule) => {
      omikujiStore.duplicateItem(category, rule.key)
    })

    const count = selectedRules.length
    toast.success(`${count}件のルールを複製しました`, {
      description: '一括複製が完了しました',
      duration: 3000,
    })
  }

  /** 一括削除の確認ダイアログ */
  const handleBulkDeleteRules = (rulesToDelete: BaseRecordType[]) => {
    if (rulesToDelete.length === 0) return

    const ruleNames = rulesToDelete.map((rule) => rule.name || '名前未設定').join('、')
    const count = rulesToDelete.length

    toast.error(`${count}件のルールを削除しますか？`, {
      description: `削除対象: ${ruleNames.length > 50 ? ruleNames.substring(0, 50) + '...' : ruleNames}`,
      duration: 0,
      action: {
        label: `${count}件削除する`,
        onClick: () => {
          const sortedRules = [...rulesToDelete].sort((a, b) => {
            const indexA = filteredSortedItems.value.findIndex((rule: BaseRecordType) => rule.key === a.key) ?? -1
            const indexB = filteredSortedItems.value.findIndex((rule: BaseRecordType) => rule.key === b.key) ?? -1
            return indexB - indexA
          })

          sortedRules.forEach((rule) => {
            omikujiStore.removeItem(validCategory.value as RecordCategoryType, rule.key)
          })

          toast.success(`${count}件のルールを削除しました`, {
            description: '一括削除が完了しました',
            duration: 3000,
          })
        },
      },
      cancel: {
        label: 'キャンセル',
        onClick: () => toast.dismiss(),
      },
      closeButton: true,
    })
  }

  return {
    isMultiSelectMode,
    selectedRuleIds,
    toggleMultiSelectMode,
    handleMultiSelect,
    selectAll,
    clearSelection,
    handleBulkDelete,
    handleBulkDeleteRules,
    getSelectedRules,

    // 新しい一括操作メソッド
    handleBulkToggleEnabled,
    handleBulkAccessLevelChange,
    handleBulkColorChange,
    handleBulkDuplicate,
  }
}
