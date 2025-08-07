// src/ConfigMaker/script/usePlaceholderStore.ts
// プレースホルダー専用store
import { PlaceholderValueType, OmikujiSetType, PostActionType, RuleType } from '@/types/';
import { useOmikujiStore } from './useOmikujiStore';
import { useRecordOperations } from './useRecordStore';
import { defineStore } from 'pinia';

export const usePlaceholderStore = defineStore('placeholder', () => {
 const baseOperations = useRecordOperations('placeholders');
 const omikujiStore = useOmikujiStore();

 // プレースホルダーが存在するかチェック
 const checkPlaceholderExists = (id: string): boolean => {
  return !!omikujiStore.data.placeholders[id];
 };

 // プレースホルダー参照を一括更新するヘルパー
 const updatePlaceholderReferences = (oldId: string, newId: string): void => {
  const oldPlaceholder = `<<${oldId}>>`;
  const newPlaceholder = `<<${newId}>>`;
  const regex = new RegExp(oldPlaceholder.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');

  // プレースホルダー内のcontent更新
  Object.values(omikujiStore.data.placeholders).forEach((placeholder) => {
   placeholder.values.forEach((value) => {
    if (value.content.includes(oldPlaceholder)) {
     value.content = value.content.replace(regex, newPlaceholder);
    }
   });
  });

  // コメントルールとタイマールールのcontent更新
  const updateRuleActions = (rules: Record<string, RuleType>) => {
   Object.values(rules).forEach((rule: RuleType) => {
    rule.omikuji.forEach((omikujiSet: OmikujiSetType) => {
     omikujiSet.postActions?.forEach((action: PostActionType) => {
      if (action.messageContent?.includes(oldPlaceholder)) {
       action.messageContent = action.messageContent.replace(regex, newPlaceholder);
      }
      if (action.messageToast?.includes(oldPlaceholder)) {
       action.messageToast = action.messageToast.replace(regex, newPlaceholder);
      }
      if (action.wordParty?.includes(oldPlaceholder)) {
       action.wordParty = action.wordParty.replace(regex, newPlaceholder);
      }
     });
    });
   });
  };

  updateRuleActions(omikujiStore.data.comments);
  updateRuleActions(omikujiStore.data.timers);
 };

 // プレースホルダーの名前を更新
 const updatePlaceholderName = (id: string, newName: string): boolean => {
  if (!checkPlaceholderExists(id)) return false;

  omikujiStore.data.placeholders[id].name = newName;
  return true;
 };

 // プレースホルダーの値を更新
 const updatePlaceholderValues = (id: string, values: PlaceholderValueType[]): boolean => {
  if (!checkPlaceholderExists(id)) return false;

  omikujiStore.data.placeholders[id].values = values;
  return true;
 };

 // プレースホルダーIDの更新
 const updatePlaceholderId = (oldId: string, newId: string): boolean => {
  // 存在チェック
  if (!checkPlaceholderExists(oldId) || omikujiStore.data.placeholders[newId]) {
   return false;
  }

  // プレースホルダーデータを移行
  const placeholderData = { ...omikujiStore.data.placeholders[oldId] };
  placeholderData.id = newId;

  omikujiStore.data.placeholders[newId] = placeholderData;
  delete omikujiStore.data.placeholders[oldId];

  // 選択状態の更新
  if (omikujiStore.selectedRuleId === oldId) {
   omikujiStore.selectRule(newId);
  }

  // 参照の更新
  updatePlaceholderReferences(oldId, newId);

  return true;
 };

 return {
  ...baseOperations,
  updatePlaceholderName,
  updatePlaceholderId,
  updatePlaceholderValues
 };
});
