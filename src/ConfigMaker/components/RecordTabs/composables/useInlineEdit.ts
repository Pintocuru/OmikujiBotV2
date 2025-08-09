// src/configMaker/components/RecordTabs/composables/useInlineEdit.ts
import { ref, nextTick, ComponentPublicInstance } from 'vue';
import { BaseTypes } from '@shared/types';

/**
 * インライン編集機能の管理
 * ルール名の直接編集、入力フィールドのフォーカス管理を提供
 */
export const useInlineEdit = (
 handleUpdateRule: (id: string, updates: Partial<BaseTypes>) => void
) => {
 /** 現在編集中のルールID（nullの場合は編集モードではない） */
 const editingRuleId = ref<string | null>(null);

 /** 編集中の名前（一時的な値） */
 const editingName = ref('');

 /** 編集用input要素への参照 */
 const editInput = ref<HTMLInputElement | null>(null);

 /**
  * インライン編集を開始
  * @param rule 編集対象のルール
  */
 const startInlineEdit = async (rule: BaseTypes) => {
  editingRuleId.value = rule.id;
  editingName.value = rule.name || '';

  // DOM更新後にinput要素にフォーカス
  await nextTick();
  if (editInput.value) {
   editInput.value.focus();
   editInput.value.select(); // 既存テキストを全選択
  }
 };

 /**
  * 編集を確定（名前を更新）
  * 空文字の場合は更新しない
  */
 const finishInlineEdit = () => {
  if (editingRuleId.value && editingName.value.trim()) {
   handleUpdateRule(editingRuleId.value, {
    name: editingName.value.trim()
   });
  }
  cancelInlineEdit();
 };

 /**
  * 編集をキャンセル（変更を破棄）
  */
 const cancelInlineEdit = () => {
  editingRuleId.value = null;
  editingName.value = '';
  editInput.value = null;
 };

 /**
  * input要素のref設定とフォーカス処理
  * Vue 3のref関数として使用
  */
 function setEditInput(el: Element | ComponentPublicInstance | null) {
  if (el instanceof HTMLInputElement) {
   // ここで HTMLInputElement として扱える
   editInput.value = el;
  } else {
   editInput.value = null;
  }
 }

 /**
  * 編集中の名前を更新
  * v-modelのupdate用
  */
 const updateEditingName = (value: string) => {
  editingName.value = value;
 };

 /**
  * Enterキーで確定、Escapeキーでキャンセル
  * @param event キーボードイベント
  */
 const handleEditKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Enter') {
   event.preventDefault();
   finishInlineEdit();
  } else if (event.key === 'Escape') {
   event.preventDefault();
   cancelInlineEdit();
  }
 };

 /**
  * 編集中かどうかを判定
  * @param ruleId チェックするルールのID
  */
 const isEditing = (ruleId: string) => {
  return editingRuleId.value === ruleId;
 };

 return {
  // 状態
  editingRuleId,
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
  isEditing
 };
};
