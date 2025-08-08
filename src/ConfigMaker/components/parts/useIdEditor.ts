// src/configMaker/components/parts/useIdEditor.ts
import { ref, computed } from 'vue';
import { RecordCategoryType } from '@/types/';
import { usePlaceholderStore } from '@ConfigStores/usePlaceholderStore';
import { useCharacterStore } from '@ConfigStores/useCharacterStore';
import { useCommentRulesStore } from '@ConfigStores/useCommentRulesStore';
import { useTimerRulesStore } from '@ConfigStores/useTimerRulesStore';

export function useIdEditor() {
 // ストア
 const characterStore = useCharacterStore();
 const placeholderStore = usePlaceholderStore();
 const commentRulesStore = useCommentRulesStore();
 const timerRulesStore = useTimerRulesStore();

 // リアクティブデータ
 const isDialogOpen = ref(false);
 const newId = ref('');
 const errorMessage = ref('');
 const characterUsage = ref<{ comments: string[]; timers: string[] } | null>(null);

 // computed
 const hasError = computed(() => errorMessage.value !== '');

 /**
  * カテゴリーに応じた表示タイトルを取得
  */
 const getDialogTitle = (mode: RecordCategoryType): string => {
  const titles = {
   comments: 'コメントルール',
   timers: 'タイマールール',
   characters: 'キャラクター',
   placeholders: 'プレースホルダー'
  } as const;
  return titles[mode];
 };

 /**
  * カテゴリーに応じた既存IDリストを取得
  */
 const getExistingIds = (mode: RecordCategoryType, currentId: string): string[] => {
  switch (mode) {
   case 'characters':
    return Object.keys(characterStore.rulesMap).filter((id) => id !== currentId);
   case 'placeholders':
    return Object.keys(placeholderStore.rulesMap).filter((id) => id !== currentId);
   case 'comments':
    return Object.keys(commentRulesStore.rulesMap).filter((id) => id !== currentId);
   case 'timers':
    return Object.keys(timerRulesStore.rulesMap).filter((id) => id !== currentId);
   default:
    return [];
  }
 };

 /**
  * キャラクターの使用状況を取得
  */
 const getCharacterUsage = (characterId: string) => {
  if (characterStore.getCharacterUsage) {
   return characterStore.getCharacterUsage(characterId);
  }
  return null;
 };

 /**
  * IDの形式をバリデーション
  */
 const validateIdFormat = (id: string): string | null => {
  if (!id.trim()) {
   return 'IDを入力してください';
  }

  // ID形式チェック（英数字とアンダースコア、ハイフンのみ）
  if (!/^[a-zA-Z0-9_-]+$/.test(id)) {
   return 'IDは英数字、アンダースコア(_)、ハイフン(-)のみ使用可能です';
  }

  return null;
 };

 /**
  * ID重複をチェック
  */
 const validateIdDuplication = (
  id: string,
  mode: RecordCategoryType,
  currentId: string
 ): string | null => {
  if (id === currentId) {
   return null; // 同じIDの場合はエラーなし
  }

  const existingIds = getExistingIds(mode, currentId);
  if (existingIds.includes(id)) {
   return 'このIDは既に使用されています';
  }

  return null;
 };

 /**
  * IDをバリデーション
  */
 const validateId = (id: string, mode: RecordCategoryType, currentId: string) => {
  const trimmedId = id.trim();

  // フォーマットチェック
  const formatError = validateIdFormat(trimmedId);
  if (formatError) {
   errorMessage.value = formatError;
   return;
  }

  // 重複チェック
  const duplicateError = validateIdDuplication(trimmedId, mode, currentId);
  if (duplicateError) {
   errorMessage.value = duplicateError;
   return;
  }

  errorMessage.value = '';
 };

 /**
  * IDを更新
  */
 const updateId = (currentId: string, newIdValue: string, mode: RecordCategoryType): boolean => {
  const trimmedNewId = newIdValue.trim();
  switch (mode) {
   case 'characters':
    return characterStore.updateCharacterId?.(currentId, trimmedNewId) ?? false;
   case 'placeholders':
    return placeholderStore.updatePlaceholderId?.(currentId, trimmedNewId) ?? false;
   case 'comments':
    return commentRulesStore.updateRuleId?.(currentId, trimmedNewId) ?? false;
   case 'timers':
    return timerRulesStore.updateRuleId?.(currentId, trimmedNewId) ?? false;
   default:
    return false;
  }
 };

 /**
  * ダイアログを開く
  */
 const openDialog = (currentId: string, mode: RecordCategoryType) => {
  newId.value = currentId;
  errorMessage.value = '';
  isDialogOpen.value = true;

  // キャラクターモードの場合、使用箇所を取得
  if (mode === 'characters') {
   characterUsage.value = getCharacterUsage(currentId);
  }
 };

 /**
  * ダイアログを閉じる
  */
 const closeDialog = () => {
  isDialogOpen.value = false;
  newId.value = '';
  errorMessage.value = '';
  characterUsage.value = null;
 };

 /**
  * IDを保存
  */
 const saveId = (currentId: string, mode: RecordCategoryType): boolean => {
  if (hasError.value || !newId.value.trim() || newId.value === currentId) {
   return false;
  }
  const success = updateId(currentId, newId.value, mode);
  if (success) {
   closeDialog();
   return true;
  } else {
   errorMessage.value = 'ID更新に失敗しました';
   return false;
  }
 };

 return {
  // リアクティブデータ
  isDialogOpen,
  newId,
  errorMessage,
  characterUsage,
  hasError,

  // メソッド
  getDialogTitle,
  validateId,
  openDialog,
  closeDialog,
  saveId
 };
}
