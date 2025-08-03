// src/ConfigMaker/script/useTimerRulesStore.ts - 簡略化されたタイマールールストア
import { TimerRuleType } from '@type/';
import { useRecordOperations } from './useRecordStore';
import { useOmikujiStore } from './useOmikujiStore';
import { defineStore } from 'pinia';

export const useTimerRulesStore = defineStore('timerRules', () => {
 const baseOperations = useRecordOperations('timers');
 const omikujiStore = useOmikujiStore();

 // タイマールール特有のメソッド
 const updateInterval = (id: string, intervalSeconds: number) => {
  return baseOperations.update(id, { intervalSeconds } as Partial<TimerRuleType>);
 };

 const getActiveRules = () => {
  return baseOperations.rulesArray.value.filter((rule) => rule.isEnabled);
 };

 const getNextExecutionTime = (rule: TimerRuleType, lastExecutionTime?: Date) => {
  const baseTime = lastExecutionTime || new Date();
  return new Date(baseTime.getTime() + rule.intervalSeconds * 1000);
 };

 /**
  * コメントルールのIDを更新する
  * @param oldId 古いID
  * @param newId 新しいID
  * @returns 更新が成功したかどうか
  */
 const updateRuleId = (oldId: string, newId: string): boolean => {
  try {
   // rulesMapから古いルールを取得
   const oldRule = baseOperations.rulesMap.value[oldId];
   if (!oldRule) {
    console.error(`Rule with ID ${oldId} not found`);
    return false;
   }

   // 新しいIDが既に存在するかチェック
   if (baseOperations.rulesMap.value[newId]) {
    console.error(`Rule with ID ${newId} already exists`);
    return false;
   }

   // Piniaストアのデータを直接操作して更新を適用
   const currentData = baseOperations.getData(); // 最新のデータを取得

   // 古いルールを削除
   delete currentData[oldId];

   // 新しいIDでルールを追加
   currentData[newId] = {
    ...oldRule,
    id: newId // ルール内のIDも更新
   };

   // 現在選択されているルールが更新対象の場合、選択を更新
   if (omikujiStore.selectedCategory === 'timers' && omikujiStore.selectedRuleId === oldId) {
    omikujiStore.selectRule(newId);
   }

   return true;
  } catch (error) {
   console.error('Error updating rule ID:', error);
   return false;
  }
 };

 return {
  ...baseOperations,
  updateInterval,
  getActiveRules,
  getNextExecutionTime,
  updateRuleId
 };
});
