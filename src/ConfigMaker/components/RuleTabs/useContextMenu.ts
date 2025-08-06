// src/configMaker/components/RuleTabs/useContextMenu.ts
// ! 削除予定
import { reactive, computed } from 'vue';
import { BaseTypes } from '@shared/types';

export function useContextMenu(rules: () => BaseTypes[]) {
 const contextMenu = reactive({
  show: false,
  x: 0,
  y: 0,
  rule: null as BaseTypes | null,
  index: -1
 });

 const getOriginalIndex = (ruleId: string): number => {
  return rules().findIndex((rule) => rule.id === ruleId);
 };

 const canMoveUp = computed(() => !!contextMenu.rule && getOriginalIndex(contextMenu.rule.id) > 0);

 const canMoveDown = computed(
  () => !!contextMenu.rule && getOriginalIndex(contextMenu.rule.id) < rules().length - 1
 );

 const showContextMenu = (event: MouseEvent, rule: BaseTypes, index: number) => {
  contextMenu.x = event.clientX;
  contextMenu.y = event.clientY;
  contextMenu.rule = rule;
  contextMenu.index = index;
  contextMenu.show = true;
 };

 const hideContextMenu = () => {
  contextMenu.show = false;
  contextMenu.rule = null;
  contextMenu.index = -1;
 };

 return {
  contextMenu,
  canMoveUp,
  canMoveDown,
  showContextMenu,
  hideContextMenu,
  getOriginalIndex
 };
}
