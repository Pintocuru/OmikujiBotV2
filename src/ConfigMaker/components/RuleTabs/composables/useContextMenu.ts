// src/configMaker/components/RuleTabs/composables/useContextMenu.ts
import { ref, computed } from 'vue';
import { BaseTypes } from '@shared/types';

export interface ContextMenuState {
 show: boolean;
 x: number;
 y: number;
 rule: BaseTypes | null;
 index: number;
}

export const useContextMenu = (allRules: any, getOriginalIndex: (id: string) => number) => {
 const contextMenu = ref<ContextMenuState>({
  show: false,
  x: 0,
  y: 0,
  rule: null,
  index: -1
 });

 const canMoveUp = computed(() => {
  if (!contextMenu.value.rule) return false;
  return getOriginalIndex(contextMenu.value.rule.id) > 0;
 });

 const canMoveDown = computed(() => {
  if (!contextMenu.value.rule) return false;
  return getOriginalIndex(contextMenu.value.rule.id) < allRules.value.length - 1;
 });

 const showContextMenu = (event: MouseEvent, rule: BaseTypes, index: number) => {
  contextMenu.value = {
   x: event.clientX,
   y: event.clientY,
   rule,
   index,
   show: true
  };
 };

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
