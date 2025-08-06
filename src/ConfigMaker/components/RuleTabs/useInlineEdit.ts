// src/configMaker/components/RuleTabs/useInlineEdit.ts
// ! 削除予定
import { ref, nextTick, onMounted, onUnmounted } from 'vue';
import { BaseTypes } from '@shared/types';

export function useInlineEdit() {
 const editingRuleId = ref<string | null>(null);
 const editingName = ref('');
 const editInput = ref<HTMLInputElement>();

 const startInlineEdit = (rule: BaseTypes) => {
  editingRuleId.value = rule.id;
  editingName.value = rule.name || '';
  nextTick(() => {
   editInput.value?.focus();
   editInput.value?.select();
  });
 };

 const finishInlineEdit = (onUpdate: (ruleId: string, updates: BaseTypes) => void) => {
  if (editingRuleId.value) {
   // BaseTypesのデータを付与できず破綻しました
   // 型 '{ name: string; }' の引数を型 '{ id: string; name: string; order: number; editorColor: string; description?: string | undefined; isEnabled?: boolean | undefined; }' のパラメーターに割り当てることはできません。
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
