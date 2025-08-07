// 🔴 src/ConfigMaker/script/useTimerRulesStore.ts
//
// データの直接操作を削除し、useRecordOperationsのメソッドを使うように修正
//
import { TimerRuleType } from '@/types/';
import { useRecordOperations } from './useRecordStore';
import { useOmikujiStore } from './useOmikujiStore';
import { defineStore } from 'pinia';

export const useTimerRulesStore = defineStore('timerRules', () => {
 const baseOperations = useRecordOperations('timers');
 const omikujiStore = useOmikujiStore();

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

 const updateRuleId = (oldId: string, newId: string): boolean => {
  try {
   const oldRule = baseOperations.rulesMap.value[oldId];
   if (!oldRule) {
    console.error(`Rule with ID ${oldId} not found`);
    return false;
   }
   if (baseOperations.rulesMap.value[newId]) {
    console.error(`Rule with ID ${newId} already exists`);
    return false;
   }

   baseOperations.remove(oldId);
   baseOperations.add();
   omikujiStore.selectRule(newId);

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
