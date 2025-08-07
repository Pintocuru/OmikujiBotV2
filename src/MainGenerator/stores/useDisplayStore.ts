// src/stores/useDisplayStore.ts
import { defineStore } from 'pinia';
import { ref, computed, watch, nextTick } from 'vue';
import { useAppStore } from './useAppStore';
import { useMessageStore } from './useMessageStore';
import { DisplaySize } from '@shared/types';
import { gameScriptMap } from '@/ConfigMaker/components/GameScripts/ScriptGameMap';
import { ScriptComponentPropsType, UserStatsType } from '@/types';

export const useDisplayStore = defineStore('display', () => {
 const appStore = useAppStore();
 const messageStore = useMessageStore();

 // State
 const displaySize = ref<DisplaySize>('md');
 const currentModeIndex = ref<number>(0);
 const currentScriptKey = ref<string | null>(null);
 const updateTrigger = ref<number>(0);
 const selectedComponent = ref<string | null>(null);

 // Getters
 const availableScriptKeys = computed(() => {
  if (!messageStore.scriptManager) return [];
  return messageStore.scriptManager.getAvailableScriptIds();
 });

 // ランキングデータを取得する関数
 const getCurrentRankings = (scriptKey: string | null): UserStatsType[] => {
  if (!scriptKey) return [];

  try {
   const rankings = messageStore.scriptManager.getRankingData(scriptKey);
   return rankings ? [...rankings] : [];
  } catch (error) {
   console.warn(`Failed to get rankings for ${scriptKey}:`, error);
   return [];
  }
 };

 const currentScriptGameProps = computed(() => {
  const scriptKey = currentScriptKey.value;
  const componentKey = scriptKey ? `game-${scriptKey}` : 'bot-mode';

  if (
   !scriptKey ||
   !gameRankingData.value ||
   !currentScriptKey.value ||
   !messageStore.scriptManager ||
   !appStore.omikujiData
  ) {
   return {
    componentKey: componentKey,
    componentConfig: null,
    settings: {},
    userRankings: [],
    displaySize: displaySize.value
   };
  }

  const props: ScriptComponentPropsType = {
   componentKey: componentKey,
   componentConfig: gameScriptMap[scriptKey].componentConfig,
   settings: { ...(appStore.omikujiData.scriptSettings?.[scriptKey] || {}) },
   userRankings: getCurrentRankings(scriptKey),
   displaySize: displaySize.value
  };

  return props;
 });

 const gameRankingData = computed(() => {
  const scriptKey = currentScriptKey.value;
  if (!messageStore.scriptManager) return new Map();
  return messageStore.scriptManager.getRankingData(scriptKey);
 });

 // Actions
 const setDisplaySize = (size: DisplaySize) => {
  displaySize.value = size;
 };

 const forceUpdate = () => {
  updateTrigger.value++;
 };

 const switchToMode = (scriptKey: string | null) => {
  const keys = availableScriptKeys.value;
  const targetIndex = keys.findIndex((key) => key === scriptKey);

  if (targetIndex !== -1) {
   currentModeIndex.value = targetIndex;
   nextTick();
   forceUpdate();
  }
 };

 const switchToBotMode = () => {
  currentScriptKey.value = null;
  currentModeIndex.value = -1;
  forceUpdate();
 };

 const switchToScriptGame = (scriptKey: string) => {
  const keys = availableScriptKeys.value;
  const index = keys.indexOf(scriptKey);
  if (index !== -1) {
   switchToMode(scriptKey);
  }
 };

 const initialize = () => {
  // 初期モードの設定
  const keys = availableScriptKeys.value;
  if (keys.length > 0) {
   currentScriptKey.value = keys[0];
   currentModeIndex.value = 0;
  } else {
   currentScriptKey.value = null;
   currentModeIndex.value = -1;
  }
  forceUpdate();
 };

 // currentScriptKeyが変更されたときに自動更新
 watch(
  currentScriptKey,
  () => {
   forceUpdate();
  },
  { immediate: false }
 );

 return {
  // State
  displaySize,
  currentModeIndex,
  currentScriptKey,
  updateTrigger,
  selectedComponent,

  // Getters
  availableScriptKeys,
  currentScriptGameProps,
  gameScriptMap: gameRankingData,

  // Actions
  setDisplaySize,
  forceUpdate,
  switchToMode,
  switchToBotMode,
  switchToScriptGame,
  initialize
 };
});
