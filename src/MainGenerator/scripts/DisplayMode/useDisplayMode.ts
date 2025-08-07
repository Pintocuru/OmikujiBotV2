// src/MainGenerator/scripts/DisplayMode/useDisplayMode.ts (互換性用)
// ! 不要、削除予定
import { gameScriptMap } from '@/ConfigMaker/components/GameScripts/ScriptGameMap';
import { useDisplayStore } from '@/MainGenerator/stores/';

export function useDisplayMode(omikujiData: any, scriptManager: any) {
 const displayStore = useDisplayStore();

 // 既存のAPIを維持するためのラッパー
 return {
  // 状態
  currentScriptKey: displayStore.currentScriptKey,
  currentScriptGameProps: displayStore.currentScriptGameProps,
  gameScriptMap: gameScriptMap, // 外部から参照
  displaySize: displayStore.displaySize,
  availableScriptKeys: displayStore.availableScriptKeys,
  selectedComponent: displayStore.selectedComponent,

  // アクション
  switchToMode: displayStore.switchToMode,
  switchToBotMode: displayStore.switchToBotMode,
  switchToScriptGame: displayStore.switchToScriptGame,
  setDisplaySize: displayStore.setDisplaySize,
  forceUpdate: displayStore.triggerUpdate,

  // 設定取得
  getDisplaySettings: displayStore.getDisplaySettings,
  getCurrentModeInfo: displayStore.getCurrentModeInfo
 };
}
