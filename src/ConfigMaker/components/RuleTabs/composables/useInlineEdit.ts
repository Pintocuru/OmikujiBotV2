// src/configMaker/components/RuleTabs/composables/useInlineEdit.ts
import { ref, ComponentPublicInstance } from 'vue';
import { BaseTypes } from '@shared/types';

export const useInlineEdit = (handleUpdateRule: (id: string, updates: BaseTypes) => void) => {
 const editingRuleId = ref<string | null>(null);
 const editingName = ref('');
 const editInput = ref<HTMLInputElement | null>(null);

 const startInlineEdit = (rule: BaseTypes) => {
  editingRuleId.value = rule.id;
  editingName.value = rule.name || '';
 };

 const finishInlineEdit = () => {
  if (editingRuleId.value && editingName.value.trim()) {
   handleUpdateRule(editingRuleId.value, {
    name: editingName.value.trim()
   } as BaseTypes);
  }
  cancelInlineEdit();
 };

 const cancelInlineEdit = () => {
  editingRuleId.value = null;
  editingName.value = '';
  editInput.value = null;
 };

 const setEditInput = (
  el: Element | ComponentPublicInstance | null,
  _refs?: Record<string, any>
 ) => {
  if (el instanceof HTMLInputElement) {
   editInput.value = el;
   el.focus();
   el.select();
  }
 };

 const updateEditingName = (value: string) => {
  editingName.value = value;
 };

 return {
  editingRuleId,
  editingName,
  editInput,
  startInlineEdit,
  finishInlineEdit,
  cancelInlineEdit,
  setEditInput,
  updateEditingName
 };
};
