// src/composables/useMessageHandler.ts
import { ref } from 'vue';
import { BotMessage } from '@/types/';
import { OmikujiDataType } from '@/types/';
import { GameScriptManager } from '@/MainGenerator/script/omikujiProcess/GameScriptManager';
import { CommentProcessor } from '@/MainGenerator/script/omikujiProcess/CommentProcessor';
import { TimerProcessor } from '@/MainGenerator/script/omikujiProcess/timerProcessor';
import { CharacterCollector } from '@/MainGenerator/script/omikujiProcess/CharacterCollector';
import { Comment } from '@onecomme.com/onesdk/types/Comment';

export function useMessageHandler(omikujiData: OmikujiDataType) {
 const botMessages = ref<BotMessage[]>([]);
 const scriptManager = new GameScriptManager(omikujiData);
 const commentProcessor = new CommentProcessor(omikujiData, scriptManager);
 const timerProcessor = new TimerProcessor(omikujiData);
 const characterCollector = new CharacterCollector(omikujiData);

 /**
  * メッセージ処理の共通ロジック
  */
 const scheduleBotMessages = (processedMessages: BotMessage[]) => {
  if (!processedMessages.length) return;

  Promise.all(
   processedMessages.map((message) => {
    const delay = message.delaySeconds * 1000;
    return new Promise<void>((resolve) => {
     setTimeout(() => {
      if (!botMessages.value.some((c) => c.id === message.id)) {
       botMessages.value = [...botMessages.value, message];
      }
      resolve();
     }, delay);
    });
   })
  );
 };

 /**
  * コメントでのおみくじ
  * TODO:もっといい関数名はないか？
  */
 const updateBotMessages = (comments: Comment[]) => {
  if (!comments.length) {
   botMessages.value = [];
   return;
  }

  const processedMessages = commentProcessor.respondToComments(comments);
  scheduleBotMessages(processedMessages);
 };

 /**
  * タイマーでのおみくじ
  */
 const processTimerMessages = (processedMessages: BotMessage[]) => {
  scheduleBotMessages(processedMessages);
 };

 return {
  // 状態
  botMessages,
  scriptManager,
  characterCollector,

  // おみくじ
  updateBotMessages,
  processTimerMessages,

  // ユーティリティ
  startTimers: () => timerProcessor.startTimers(processTimerMessages), // タイマー開始
  stopTimers: () => timerProcessor.stopTimers(), // タイマー停止
  clearMessages: () => (botMessages.value = []) // メッセージをクリア
 };
}
