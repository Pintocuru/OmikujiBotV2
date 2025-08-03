// composables/useDelayedDisplay.ts
import { ref, watch, onUnmounted } from 'vue';

interface DelayedDisplayOptions {
 delayMs: number; // 遅延時間（ミリ秒）
 displayMs: number; // 表示時間（ミリ秒）
 immediate?: boolean; // 即座に監視を開始するかどうか
 deep?: boolean; // 深い監視を行うかどうか
}

export function useDelayedDisplay<T>(watchTarget: () => T, options: DelayedDisplayOptions) {
 const { delayMs, displayMs, immediate = false, deep = true } = options;

 // 表示状態を管理
 const isVisible = ref(false);

 // タイマーの参照を保持
 let delayTimer: ReturnType<typeof setTimeout> | null = null;
 let displayTimer: ReturnType<typeof setTimeout> | null = null;

 // タイマーをクリアする関数
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

 // 表示を開始する関数
 const startDisplay = () => {
  // 既存のタイマーをクリア
  clearTimers();

  // 表示を一旦隠す
  isVisible.value = false;

  // 遅延時間後に表示開始
  delayTimer = setTimeout(() => {
   isVisible.value = true;

   // 表示時間後に非表示
   displayTimer = setTimeout(() => {
    isVisible.value = false;
   }, displayMs);
  }, delayMs);
 };

 // 監視対象の変更を監視
 watch(
  watchTarget,
  (newValue) => {
   // 配列の場合は要素があるかチェック、それ以外は truthy かチェック
   const hasValue = Array.isArray(newValue) ? newValue.length > 0 : !!newValue;

   // 値がある場合のみ表示を開始
   if (hasValue) {
    startDisplay();
   }
  },
  { immediate, deep }
 );

 // 手動で表示を開始する関数
 const manualStart = () => {
  startDisplay();
 };

 // 手動で非表示にする関数
 const manualHide = () => {
  clearTimers();
  isVisible.value = false;
 };

 // コンポーネントが破棄される際のクリーンアップ
 onUnmounted(() => {
  clearTimers();
 });

 return {
  isVisible,
  manualStart,
  manualHide,
  clearTimers
 };
}
