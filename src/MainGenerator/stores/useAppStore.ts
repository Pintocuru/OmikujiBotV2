// src/stores/useAppStore.ts
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { OmikujiDataSchema, BotMessage, OmikujiDataType } from '@/types/';
import { ConfigUserSchema } from '@shared/types';
import { AppState } from './types';

export const useAppStore = defineStore('app', () => {
 // State
 const isInitialized = ref<boolean>(false);
 const omikujiData = ref<OmikujiDataType | null>(null);
 const config = ref<any>(null);

 // Getters
 const isReady = computed(() => isInitialized.value && omikujiData.value !== null);
 const displaySettings = computed(() => omikujiData.value?.displaySettings);
 const godModeEnabled = computed(() => displaySettings.value?.developer?.godModeEnabled ?? false);
 const toastEnabled = computed(() => displaySettings.value?.base?.toastEnabled ?? false);
 const modeSwitchEnabled = computed(() => displaySettings.value?.base?.modeSwitchEnabled ?? false);

 // Actions
 const initialize = async () => {
  try {
   omikujiData.value = OmikujiDataSchema.parse(window.omikujiData);
   config.value = ConfigUserSchema.parse(window.userConfig);
   isInitialized.value = true;
   return true;
  } catch (error) {
   console.error('アプリの初期化エラー:', error);
   isInitialized.value = false;
   return false;
  }
 };

 const setInitialized = (value: boolean) => {
  isInitialized.value = value;
 };

 return {
  // State
  isInitialized,
  omikujiData,
  config,

  // Getters
  isReady,
  displaySettings,
  godModeEnabled,
  toastEnabled,
  modeSwitchEnabled,

  // Actions
  initialize,
  setInitialized
 };
});
