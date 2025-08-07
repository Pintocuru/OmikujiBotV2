// src/MainGenerator/scripts/omikujiProcess/useMessageHandler.ts (互換性用)
// ! 不要、削除予定
import { useAppStore } from '@/MainGenerator/stores/';

export function useMessageHandler(omikujiData: any) {
 const appStore = useAppStore();

 // 既存のAPIを維持するためのラッパー
 return {
  // 状態
  botMessages: appStore.botMessages,
  scriptManager: appStore.scriptManager,
  characterCollector: appStore.characterCollector,

  // おみくじ
  updateBotMessages: appStore.updateBotMessages,
  processTimerMessages: appStore.processTimerMessages,

  // ユーティリティ
  startTimers: appStore.startTimers,
  stopTimers: appStore.stopTimers,
  clearMessages: appStore.clearMessages
 };
}
