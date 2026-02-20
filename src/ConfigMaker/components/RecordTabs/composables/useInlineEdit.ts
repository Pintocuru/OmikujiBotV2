// src/ConfigMaker/components/RecordTabs/composables/useInlineEdit.ts
import { ref, nextTick, ComponentPublicInstance } from 'vue'
import { BaseRecordType } from '@shared/types'

/**
 * インライン編集機能の管理
 */
export const useInlineEdit = (handleUpdateRule: (key: string, updates: Partial<BaseRecordType>) => void) => {
  const editingRuleKey = ref<string | null>(null)
  const editingName = ref('')
  const editInput = ref<HTMLInputElement | null>(null)

  // インライン編集を開始
  const startInlineEdit = async (rule: BaseRecordType) => {
    editingRuleKey.value = rule.key
    editingName.value = rule.name || ''

    await nextTick()
    if (editInput.value) {
      editInput.value.focus()
      editInput.value.select() // 既存テキストを全選択
    }
  }

  // 名前を更新
  const finishInlineEdit = () => {
    if (editingRuleKey.value && editingName.value.trim()) {
      handleUpdateRule(editingRuleKey.value, {
        name: editingName.value.trim(),
      })
    }
    cancelInlineEdit()
  }

  // 編集をキャンセル
  const cancelInlineEdit = () => {
    editingRuleKey.value = null
    editingName.value = ''
    editInput.value = null
  }

  // input要素のref設定とフォーカス処理
  function setEditInput(el: Element | ComponentPublicInstance | null) {
    if (el instanceof HTMLInputElement) editInput.value = el
    else editInput.value = null
  }

  // 編集中の名前を更新
  const updateEditingName = (value: string) => {
    editingName.value = value
  }

  // Enterキーで確定、Escapeキーでキャンセル
  const handleEditKeydown = (event: KeyboardEvent) => {
    if (event.key === 'Enter') {
      event.preventDefault()
      finishInlineEdit()
    } else if (event.key === 'Escape') {
      event.preventDefault()
      cancelInlineEdit()
    }
  }

  // 編集中かどうかを判定
  const isEditing = (ruleId: string) => editingRuleKey.value === ruleId

  return {
    // 状態
    editingRuleId: editingRuleKey,
    editingName,
    editInput,

    // アクション
    startInlineEdit,
    finishInlineEdit,
    cancelInlineEdit,
    setEditInput,
    updateEditingName,
    handleEditKeydown,

    // ユーティリティ
    isEditing,
  }
}
