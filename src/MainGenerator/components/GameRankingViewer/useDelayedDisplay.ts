// composables/useDelayedDisplay.ts
import { UserStatsType } from '@/types';
import { ref, onUnmounted, watch, Ref } from 'vue';

interface DelayedDisplayOptions {
 delayMs: number;
 displayMs: number;
}

// 配列の中身を比較するヘルパー関数
function areArraysContentEqual(a: UserStatsType[], b: UserStatsType[]): boolean {
 if (a.length !== b.length) return false;
 try {
  return JSON.stringify(a) === JSON.stringify(b);
 } catch (e) {
  console.error('JSON.stringify failed:', e);
  return false;
 }
}

export function useDelayedDisplay(
 userRankings: Ref<UserStatsType[]>,
 options: DelayedDisplayOptions
) {
 const { delayMs, displayMs } = options;
 const isVisible = ref(false);

 let delayTimer: ReturnType<typeof setTimeout> | null = null;
 let displayTimer: ReturnType<typeof setTimeout> | null = null;

 const clearTimers = () => {
  if (delayTimer) {
   clearTimeout(delayTimer);
   delayTimer = null;
  }
  if (displayTimer) {
   clearTimeout(displayTimer);
   displayTimer = null;
  }
 };

 const startDisplay = () => {
  clearTimers();
  isVisible.value = false;
  if (userRankings.value.length === 0) return;

  delayTimer = setTimeout(() => {
   isVisible.value = true;

   displayTimer = setTimeout(() => {
    isVisible.value = false;
   }, displayMs);
  }, delayMs);
 };

 watch(
  () => userRankings.value,
  (newValue, oldValue) => {
   const isInitialRun = oldValue === undefined;
   const hasContentChanged = !areArraysContentEqual(newValue || [], oldValue || []);

   if (isInitialRun || hasContentChanged) {
    startDisplay();
   }
  },
  { immediate: false }
 );

 onUnmounted(() => {
  clearTimers();
 });

 return {
  isVisible,
  clearTimers
 };
}
