// src/configMaker/components/RuleTabs/RuleTabsStore.ts (メインストア)
import { defineStore } from 'pinia';
import { useRuleState } from './composables/useRuleState';
import { useRuleOperations } from './composables/useRuleOperations';
import { useMultiSelect } from './composables/useMultiSelect';
import { useContextMenu } from './composables/useContextMenu';
import { useInlineEdit } from './composables/useInlineEdit';
import { useDragAndDrop } from './composables/useDragAndDrop';

export const useRuleTabsStore = defineStore('ruleTabs', () => {
 // 基本状態管理
 const ruleState = useRuleState();

 // 各種操作機能
 const ruleOperations = useRuleOperations(ruleState.validCategory, ruleState.categoryArray);
 const multiSelect = useMultiSelect(ruleState.filteredSortedItems);
 const contextMenu = useContextMenu(ruleState.categoryArray, ruleOperations.getOriginalIndex);
 const inlineEdit = useInlineEdit(ruleOperations.handleUpdateRule);
 const dragAndDrop = useDragAndDrop(
  ruleState.filteredSortedItems,
  ruleState.categoryArray,
  ruleState.externalStore,
  multiSelect.isMultiSelectMode
 );

 // コンテキストメニューのハンドラー
 const handleContextMoveUp = () => {
  if (contextMenu.contextMenu.value.rule && contextMenu.canMoveUp.value) {
   const originalIndex = ruleOperations.getOriginalIndex(contextMenu.contextMenu.value.rule.id);
   ruleOperations.handleMoveRuleUp(contextMenu.contextMenu.value.rule.id, originalIndex);
  }
  contextMenu.hideContextMenu();
 };

 const handleContextMoveDown = () => {
  if (contextMenu.contextMenu.value.rule && contextMenu.canMoveDown.value) {
   const originalIndex = ruleOperations.getOriginalIndex(contextMenu.contextMenu.value.rule.id);
   ruleOperations.handleMoveRuleDown(
    contextMenu.contextMenu.value.rule.id,
    originalIndex,
    ruleState.categoryArray.value.length
   );
  }
  contextMenu.hideContextMenu();
 };

 const handleContextDuplicate = () => {
  if (contextMenu.contextMenu.value.rule) {
   ruleOperations.handleDuplicateRule(contextMenu.contextMenu.value.rule.id);
  }
  contextMenu.hideContextMenu();
 };

 const handleContextDelete = () => {
  if (contextMenu.contextMenu.value.rule) {
   ruleOperations.handleDeleteRule(
    contextMenu.contextMenu.value.rule.id,
    contextMenu.contextMenu.value.rule.name
   );
  }
  contextMenu.hideContextMenu();
 };

 return {
  ...ruleState, // 基本状態
  ...multiSelect, // マルチセレクト
  ...contextMenu, // コンテキストメニュー
  ...inlineEdit, // インライン編集
  ...dragAndDrop, // ドラッグ&ドロップ
  ...ruleOperations, // ルール操作

  // コンテキストメニューハンドラー
  handleContextMoveUp,
  handleContextMoveDown,
  handleContextDuplicate,
  handleContextDelete
 };
});
