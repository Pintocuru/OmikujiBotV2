// src/composables/useDisplayModeSwitcher.ts
import { nextTick } from 'vue';
import { GameScriptManager } from '@/MainGenerator/script/omikujiProcess/GameScriptManager';

export function useDisplayModeSwitcher(
 currentModeIndex: { value: number },
 availableScriptKeys: { value: (string | null)[] },
 displaySettings: any,
 scriptManager: GameScriptManager,
 forceUpdate: () => void
) {
 // 特定のモードに直接切り替え
 const switchToMode = async (scriptKey: string | null) => {
  const keys = availableScriptKeys.value;
  const targetIndex = keys.findIndex((key) => key === scriptKey);

  if (targetIndex !== -1) {
   currentModeIndex.value = targetIndex;
   await nextTick();
   forceUpdate();
  }
 };

 // BOTちゃんモードに切り替え
 const switchToBotMode = () => {
  return switchToMode(null);
 };

 // ゲームスクリプトモードに切り替え
 const switchToScriptGame = (scriptKey: string) => {
  return switchToMode(scriptKey);
 };

 // 初期化処理
 const initialize = () => {
  const selectedComponent = displaySettings.developer.selectComponent;

  if (selectedComponent === 'omikujiBot') {
   currentModeIndex.value = 0; // BOTモード
  } else if (selectedComponent === 'gameScript') {
   const defaultKey = displaySettings.developer.defaultScriptKey;
   const activeScripts = scriptManager.getActiveScripts();

   if (defaultKey && activeScripts.includes(defaultKey)) {
    const keys = availableScriptKeys.value;
    const targetIndex = keys.findIndex((key) => key === defaultKey);
    if (targetIndex !== -1) {
     currentModeIndex.value = targetIndex;
    }
   } else if (activeScripts.length > 0) {
    currentModeIndex.value = 1; // BOTモードの次
   }
  }

  forceUpdate();
 };

 return {
  switchToMode,
  switchToBotMode,
  switchToScriptGame,
  initialize
 };
}
