// src/stores/useMessageStore.ts
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { BotMessage } from '@/types/';
import { GameScriptManager } from '@/MainGenerator/scripts/omikujiProcess/GameScriptManager';
import { CommentProcessor } from '@/MainGenerator/scripts/omikujiProcess/CommentProcessor';
import { TimerProcessor } from '@/MainGenerator/scripts/omikujiProcess/timerProcessor';
import { CharacterCollector } from '@/MainGenerator/scripts/omikujiProcess/CharacterCollector';
import { Comment } from '@onecomme.com/onesdk/types/Comment';
import { useAppStore } from './useAppStore';

export const useMessageStore = defineStore('message', () => {
 const appStore = useAppStore();

 // State
 const botMessages = ref<BotMessage[]>([]);
 const scriptManager = ref<GameScriptManager | null>(null);
 const commentProcessor = ref<CommentProcessor | null>(null);
 const timerProcessor = ref<TimerProcessor | null>(null);
 const characterCollector = ref<CharacterCollector | null>(null);

 // Getters
 const hasMessages = computed(() => botMessages.value.length > 0);
 const latestMessage = computed(() =>
  botMessages.value.length > 0 ? botMessages.value[botMessages.value.length - 1] : null
 );
 const messageCount = computed(() => botMessages.value.length);

 // Actions
 const initializeManagers = () => {
  if (!appStore.omikujiData) {
   throw new Error('OmikujiData が初期化されていません');
  }

  const scriptManagerInstance = new GameScriptManager(appStore.omikujiData);
  scriptManager.value = scriptManagerInstance;
  commentProcessor.value = new CommentProcessor(appStore.omikujiData, scriptManagerInstance);
  timerProcessor.value = new TimerProcessor(appStore.omikujiData);
  characterCollector.value = new CharacterCollector(appStore.omikujiData);
 };

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

 const updateBotMessages = (comments: Comment[]) => {
  if (!commentProcessor.value) {
   console.warn('CommentProcessor が初期化されていません');
   return;
  }

  if (!comments.length) {
   botMessages.value = [];
   return;
  }

  const processedMessages = commentProcessor.value.respondToComments(comments);
  scheduleBotMessages(processedMessages);
 };

 const processTimerMessages = (processedMessages: BotMessage[]) => {
  scheduleBotMessages(processedMessages);
 };

 const addMessage = (message: BotMessage) => {
  if (!botMessages.value.some((c) => c.id === message.id)) {
   botMessages.value = [...botMessages.value, message];
  }
 };

 const clearMessages = () => {
  botMessages.value = [];
 };

 const startTimers = () => {
  timerProcessor.value?.startTimers(processTimerMessages);
 };

 const stopTimers = () => {
  timerProcessor.value?.stopTimers();
 };

 return {
  // State
  botMessages,
  scriptManager,
  characterCollector,

  // Getters
  hasMessages,
  latestMessage,
  messageCount,

  // Actions
  initializeManagers,
  updateBotMessages,
  processTimerMessages,
  addMessage,
  clearMessages,
  startTimers,
  stopTimers
 };
});
