// src\MainGenerator\scripts\DisplayMode\useDisplayMode.ts
import { onMounted, watch } from 'vue';
import { OmikujiDataType } from '@/types/';
import { GameScriptManager } from '@MainScripts/omikujiProcess/GameScriptManager';
import { useDisplayCore } from './useDisplayCore';
import { useDisplayModeSwitcher } from './useDisplayModeSwitcher';
import { useDisplayScriptProps } from './useDisplayScriptProps';

export function useDisplayMode(omikujiData: OmikujiDataType, scriptManager: GameScriptManager) {
 // コア機能
 const {
  displaySize,
  currentModeIndex,
  updateTrigger,
  selectedComponent,
  availableScriptKeys,
  currentScriptKey,
  setDisplaySize,
  forceUpdate,
  displaySettings
 } = useDisplayCore(omikujiData, scriptManager);

 // モード切り替え機能
 const { switchToMode, switchToBotMode, switchToScriptGame, initialize } = useDisplayModeSwitcher(
  currentModeIndex,
  availableScriptKeys,
  displaySettings,
  scriptManager,
  forceUpdate
 );

 // スクリプトプロパティ管理
 const { currentScriptGameProps, gameScriptMap } = useDisplayScriptProps(
  omikujiData,
  scriptManager,
  currentScriptKey,
  displaySize,
  updateTrigger
 );

 // 情報取得用のヘルパー関数
 const getDisplaySettings = () => {
  return {
   ...displaySettings,
   currentDisplaySize: displaySize.value
  };
 };

 const getCurrentModeInfo = () => {
  const keys = availableScriptKeys.value;
  return {
   currentIndex: currentModeIndex.value,
   totalModes: keys.length,
   currentScriptKey: currentScriptKey.value,
   availableScriptKeys: [...keys],
   selectedComponent: selectedComponent.value
  };
 };

 // currentScriptKeyが変更されたときに自動更新
 watch(
  currentScriptKey,
  () => {
   forceUpdate();
  },
  { immediate: false }
 );

 // ライフサイクル
 onMounted(() => {
  initialize();
 });

 return {
  // 状態
  currentScriptKey,
  currentScriptGameProps,
  gameScriptMap,
  displaySize,
  availableScriptKeys,
  selectedComponent,

  // アクション
  switchToMode,
  switchToBotMode,
  switchToScriptGame,
  setDisplaySize,
  forceUpdate,

  // 設定取得
  getDisplaySettings,
  getCurrentModeInfo
 };
}
