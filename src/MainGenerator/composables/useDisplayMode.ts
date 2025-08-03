// src/composables/useDisplayMode.ts
import { ref, computed, onMounted } from 'vue';
import { OmikujiDataType, ScriptComponentPropsType } from '@/types/';
import { scriptGameMap } from '@/ScriptGame/ScriptGameMap';
import { GameScriptManager } from '@/MainGenerator/omikujiProcess/GameScriptManager';
import { DisplaySize } from '@shared/types';

export function useDisplayMode(omikujiData: OmikujiDataType, scriptManager: GameScriptManager) {
 const displaySettings = omikujiData.displaySettings;
 const displaySize = ref<DisplaySize>(displaySettings.displaySize);
 const forceRender = ref(0);
 const currentModeIndex = ref(0);

 // 有効なscriptKey配列を動的に構築（null = BOTちゃん、string = ゲームスクリプト）
 const availableScriptKeys = computed((): (string | null)[] => {
  const keys: (string | null)[] = [];
  keys.push(null); // BOTちゃんモード（null）
  // アクティブなゲームスクリプトを追加
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

 // 現在のゲームスクリプトの設定情報（componentConfigを使用）
 const currentScriptGameProps = computed((): ScriptComponentPropsType => {
  forceRender.value;
  const scriptKey = currentScriptKey.value;

  if (!scriptKey || !scriptGameMap[scriptKey]) {
   return {
    componentConfig: null,
    settings: {},
    userRankings: [],
    displaySize: displaySize.value
   };
  }

  const rankingData = scriptManager.getRankingData(scriptKey);

  return {
   componentConfig: scriptGameMap[scriptKey].componentConfig,
   settings: omikujiData.scriptSettings?.[scriptKey] || {},
   userRankings: rankingData || [],
   displaySize: displaySize.value
  };
 });

 // 特定のモードに直接切り替え
 const switchToMode = (scriptKey: string | null) => {
  const keys = availableScriptKeys.value;
  const targetIndex = keys.findIndex((key) => key === scriptKey);

  if (targetIndex !== -1) {
   currentModeIndex.value = targetIndex;
  }
 };

 // BOTちゃんモードに切り替え
 const switchToBotMode = () => {
  switchToMode(null);
 };

 // ゲームスクリプトモードに切り替え
 const switchToScriptGame = (scriptKey: string) => {
  switchToMode(scriptKey);
 };

 // 表示サイズ変更
 const setDisplaySize = (size: DisplaySize) => {
  displaySize.value = size;
 };

 // 更新用
 const forceUpdate = () => {
  forceRender.value++;
 };

 // 初期化処理
 const initialize = () => {
  // displaySizeをsettingsから初期化
  displaySize.value = displaySettings.displaySize;

  // デフォルトモード設定
  switchToMode(displaySettings.defaultScriptKey);
 };

 // 設定情報を取得
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
   availableScriptKeys: keys
  };
 };

 // ライフサイクル
 onMounted(() => {
  initialize();
 });

 return {
  // 状態
  currentScriptKey, // 新しいメイン状態
  currentScriptGameProps,
  scriptGameMap,
  displaySize,
  availableScriptKeys, // 新しく追加

  // アクション
  switchToMode, // メインのモード切り替え
  switchToBotMode, // BOTちゃんモードに切り替え
  switchToScriptGame, // ゲームスクリプトに切り替え
  setDisplaySize,
  forceUpdate,

  // 設定取得
  getDisplaySettings,
  getCurrentModeInfo
 };
}
