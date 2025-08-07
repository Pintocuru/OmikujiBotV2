// src/composables/useDisplayCore.ts
import { ref, computed } from 'vue';
import { OmikujiDataType } from '@/types/';
import { DisplaySize } from '@shared/types';
import { GameScriptManager } from '@/MainGenerator/script/omikujiProcess/GameScriptManager';

export function useDisplayCore(omikujiData: OmikujiDataType, scriptManager: GameScriptManager) {
 const displaySettings = omikujiData.displaySettings;
 const displaySize = ref<DisplaySize>(displaySettings.base.displaySize);
 const currentModeIndex = ref(0);
 const updateTrigger = ref(0);

 // コンポーネント選択設定
 const selectedComponent = computed(() => {
  return displaySettings.developer.selectComponent;
 });

 // 有効なscriptKey配列を動的に構築
 const availableScriptKeys = computed((): (string | null)[] => {
  const keys: (string | null)[] = [];
  // BOTちゃんモード
  keys.push(null);
  // アクティブなゲームスクリプト
  const activeScripts = scriptManager.getActiveScripts();
  activeScripts.forEach((scriptKey) => keys.push(scriptKey));
  return keys;
 });

 // 現在のscriptKey
 const currentScriptKey = computed((): string | null => {
  const keys = availableScriptKeys.value;
  if (keys.length === 0) return null;
  if (currentModeIndex.value >= keys.length) currentModeIndex.value = 0;
  return keys[currentModeIndex.value];
 });

 // 表示サイズ変更
 const setDisplaySize = (size: DisplaySize) => {
  displaySize.value = size;
  forceUpdate();
 };

 // 強制更新
 const forceUpdate = () => {
  updateTrigger.value += 1;
 };

 return {
  // 状態
  displaySize,
  currentModeIndex,
  updateTrigger,
  selectedComponent,
  availableScriptKeys,
  currentScriptKey,

  // アクション
  setDisplaySize,
  forceUpdate,

  // 設定
  displaySettings
 };
}
