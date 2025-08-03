// src/configMaker/components/RuleTabs/useInlineEdit.ts
import { ref, nextTick, onMounted, onUnmounted } from 'vue';
import type { BaseRule } from './RuleTabsTypes';

export function useInlineEdit() {
 const editingRuleId = ref<string | null>(null);
 const editingName = ref('');
 const editInput = ref<HTMLInputElement>();

 const startInlineEdit = (rule: BaseRule) => {
  editingRuleId.value = rule.id;
  editingName.value = rule.name || '';
  nextTick(() => {
   editInput.value?.focus();
   editInput.value?.select();
  });
 };

 const finishInlineEdit = (onUpdate: (ruleId: string, updates: Partial<BaseRule>) => void) => {
  if (editingRuleId.value) {
   onUpdate(editingRuleId.value, { name: editingName.value });
   editingRuleId.value = null;
  }
 };

 const cancelInlineEdit = () => {
  editingRuleId.value = null;
  editingName.value = '';
 };

 const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && editingRuleId.value) {
   cancelInlineEdit();
  }
 };

 onMounted(() => {
  document.addEventListener('keydown', handleKeydown);
 });

 onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown);
 });

 return {
  editingRuleId,
  editingName,
  editInput,
  startInlineEdit,
  finishInlineEdit,
  cancelInlineEdit
 };
}
