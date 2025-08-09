// src/configMaker/components/RecordTabs/composables/useContextMenu.ts
import { ref, computed } from 'vue';
import type { useRuleState } from './useRuleState';
import { BaseTypes } from '@shared/types';

/** コンテキストメニューの状態 */
export interface ContextMenuState {
 show: boolean;
 x: number;
 y: number;
 rule: BaseTypes | null;
 index: number;
}

/**
 * 右クリックコンテキストメニューの管理
 * 表示/非表示、位置、対象ルール、移動可否判定を提供
 */
export const useContextMenu = (ruleState: ReturnType<typeof useRuleState>) => {
 const { categoryArray } = ruleState;

 /** コンテキストメニューの状態 */
 const contextMenu = ref<ContextMenuState>({
  show: false,
  x: 0,
  y: 0,
  rule: null,
  index: -1
 });

 /** ルールのインデックスを取得 */
 const getOriginalIndex = (ruleId: string): number => {
  if (!categoryArray.value) return 0;
  return categoryArray.value.findIndex((rule: BaseTypes) => rule.id === ruleId);
 };

 /** 上に移動可能かどうか */
 const canMoveUp = computed(() => {
  if (!contextMenu.value.rule) return false;
  return getOriginalIndex(contextMenu.value.rule.id) > 0;
 });

 /** 下に移動可能かどうか */
 const canMoveDown = computed(() => {
  if (!contextMenu.value.rule || !categoryArray.value) return false;
  return getOriginalIndex(contextMenu.value.rule.id) < categoryArray.value.length - 1;
 });

 /** コンテキストメニューを表示 */
 const showContextMenu = (event: MouseEvent, rule: BaseTypes, index: number) => {
  event.preventDefault();
  contextMenu.value = {
   x: event.clientX,
   y: event.clientY,
   rule,
   index,
   show: true
  };
 };

 /** コンテキストメニューを非表示 */
 const hideContextMenu = () => {
  contextMenu.value = {
   show: false,
   x: 0,
   y: 0,
   rule: null,
   index: -1
  };
 };

 return {
  contextMenu,
  canMoveUp,
  canMoveDown,
  showContextMenu,
  hideContextMenu
 };
};
