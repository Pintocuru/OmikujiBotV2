// src/configMaker/components/RuleTabs/RuleTabsStore.ts (メインストア)
import { defineStore } from 'pinia';
import { useRuleState } from './composables/useRuleState';
import { useRuleOperations } from './composables/useRuleOperations';
import { useMultiSelect } from './composables/useMultiSelect';
import { useContextMenu } from './composables/useContextMenu';
import { useInlineEdit } from './composables/useInlineEdit';
import { useDragAndDrop } from './composables/useDragAndDrop';

/**
 * ルールタブ機能の統合ストア
 * 各composableの機能を統合し、UIコンポーネントに必要な機能を提供
 */
export const useRuleTabsStore = defineStore('ruleTabs', () => {
 // 基本状態管理（データ、フィルター、検索など）
 const ruleState = useRuleState();

 // 各種操作機能の初期化（ruleStateを一括で渡すことで依存関係を簡素化）
 const ruleOperations = useRuleOperations(ruleState);
 const multiSelect = useMultiSelect(ruleState);
 const contextMenu = useContextMenu(ruleState);
 const inlineEdit = useInlineEdit(ruleOperations.handleUpdateRule);
 const dragAndDrop = useDragAndDrop(ruleState, multiSelect.isMultiSelectMode);

 // === コンテキストメニューのアクション統合 ===

 /** コンテキストメニューから「上に移動」を実行 */
 const handleContextMoveUp = () => {
  const { rule } = contextMenu.contextMenu.value;
  if (rule && contextMenu.canMoveUp.value) {
   const originalIndex = ruleOperations.getOriginalIndex(rule.id);
   ruleOperations.handleMoveRuleUp(rule.id, originalIndex);
  }
  contextMenu.hideContextMenu();
 };

 /** コンテキストメニューから「下に移動」を実行 */
 const handleContextMoveDown = () => {
  const { rule } = contextMenu.contextMenu.value;
  if (rule && contextMenu.canMoveDown.value) {
   const originalIndex = ruleOperations.getOriginalIndex(rule.id);
   ruleOperations.handleMoveRuleDown(
    rule.id,
    originalIndex,
    ruleState.categoryArray.value?.length || 0
   );
  }
  contextMenu.hideContextMenu();
 };

 /** コンテキストメニューから「複製」を実行 */
 const handleContextDuplicate = () => {
  const { rule } = contextMenu.contextMenu.value;
  if (rule) {
   ruleOperations.handleDuplicateRule(rule.id);
  }
  contextMenu.hideContextMenu();
 };

 /** コンテキストメニューから「削除」を実行 */
 const handleContextDelete = () => {
  const { rule } = contextMenu.contextMenu.value;
  if (rule) {
   ruleOperations.handleDeleteRule(rule.id, rule.name);
  }
  contextMenu.hideContextMenu();
 };

 // すべての機能をエクスポート
 return {
  // 基本状態
  ...ruleState,

  // 操作機能
  ...ruleOperations,
  ...multiSelect,
  ...contextMenu,
  ...inlineEdit,
  ...dragAndDrop,

  // 統合されたコンテキストメニューハンドラー
  handleContextMoveUp,
  handleContextMoveDown,
  handleContextDuplicate,
  handleContextDelete
 };
});
