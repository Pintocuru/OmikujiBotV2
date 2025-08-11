// src\MainGenerator\stores\index.ts
import { defineStore } from 'pinia';
import { ref } from 'vue';
import { OmikujiDataSchema, BotMessage } from '@/types/';
import { ConfigUserSchema } from '@shared/types';
import { GetUserComments } from '@shared/sdk/subscribe/GetUserComments';
import { GameScriptManager } from '@MainScripts/omikujiProcess/GameScriptManager';
import { CommentProcessor } from '@MainScripts/omikujiProcess/CommentProcessor';
import { TimerProcessor } from '@MainScripts/omikujiProcess/timerProcessor';
import { CharacterCollector } from '@/MainGenerator/scripts/BotCharacter/CharacterCollector';
import { Comment } from '@onecomme.com/onesdk/types/Comment';
import { useDisplayStore } from './useDisplayStore';

export const useAppStore = defineStore('app', () => {
 // 基本設定
 const omikujiData = OmikujiDataSchema.parse(window.omikujiData);
 const config = ConfigUserSchema.parse(window.userConfig);

 // 初期化状態
 const isInitialized = ref(true);

 // メッセージ関連
 const botMessages = ref<BotMessage[]>([]);

 // インスタンス
 const scriptManager = new GameScriptManager(omikujiData);
 const commentProcessor = new CommentProcessor(omikujiData, scriptManager);
 const timerProcessor = new TimerProcessor(omikujiData);
 const characterCollector = new CharacterCollector(omikujiData);

 /**
  * アプリケーションの初期化
  */
 const initializeApp = async (): Promise<boolean> => {
  try {
   const isInit = await GetUserComments(config).fetchComments((comments) => {
    updateBotMessages(comments);
    forceUpdate();
   });
   isInitialized.value = isInit;
   if (isInit) startTimers();

   return isInit;
  } catch (error) {
   console.error('初期化エラー:', error);
   isInitialized.value = false;
   return false;
  }
 };

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

 // botMessageを追加
 const addBotMessage = (message: BotMessage) => {
  botMessages.value = [...botMessages.value, message];
 };

 /**
  * コメントでのおみくじ処理
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
  * タイマーでのおみくじ処理
  */
 const processTimerMessages = (processedMessages: BotMessage[]) => {
  scheduleBotMessages(processedMessages);
 };

 // タイマー開始
 const startTimers = () => {
  timerProcessor.startTimers(processTimerMessages);
 };
 //  タイマー停止
 const stopTimers = () => {
  timerProcessor.stopTimers();
 };

 // メッセージクリア
 const clearMessages = () => {
  botMessages.value = [];
 };

 /**
  * 強制更新（displayStoreから呼び出される）
  */
 const forceUpdate = () => {
  // displayStoreの更新をトリガー
  const displayStore = useDisplayStore();
  displayStore.triggerUpdate();
 };

 return {
  // 状態
  omikujiData,
  config,
  isInitialized,
  botMessages,
  scriptManager,
  commentProcessor,
  timerProcessor,
  characterCollector,
  addBotMessage,

  // アクション
  initializeApp,
  updateBotMessages,
  processTimerMessages,
  startTimers,
  stopTimers,
  clearMessages,
  forceUpdate
 };
});
