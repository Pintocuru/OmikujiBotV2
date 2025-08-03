// src/configMaker/components/RuleTabs/useContextMenu.ts
import { reactive, computed } from 'vue';
import type { BaseRule } from './RuleTabsTypes';

export function useContextMenu(rules: () => BaseRule[]) {
 const contextMenu = reactive({
  show: false,
  x: 0,
  y: 0,
  rule: null as BaseRule | null,
  index: -1
 });

 const getOriginalIndex = (ruleId: string): number => {
  return rules().findIndex((rule) => rule.id === ruleId);
 };

 const canMoveUp = computed(() => !!contextMenu.rule && getOriginalIndex(contextMenu.rule.id) > 0);

 const canMoveDown = computed(
  () => !!contextMenu.rule && getOriginalIndex(contextMenu.rule.id) < rules().length - 1
 );

 const showContextMenu = (event: MouseEvent, rule: BaseRule, index: number) => {
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
