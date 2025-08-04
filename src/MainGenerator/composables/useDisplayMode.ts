// src/composables/useDisplayMode.ts
import { ref, computed, onMounted, watch } from 'vue';
import { OmikujiDataType, ScriptComponentPropsType, UserStatsType } from '@/types/';
import { DisplaySize } from '@shared/types';
import { scriptGameMap } from '@/ScriptGame/ScriptGameMap';
import { GameScriptManager } from '@/MainGenerator/omikujiProcess/GameScriptManager';

export function useDisplayMode(omikujiData: OmikujiDataType, scriptManager: GameScriptManager) {
 const displaySettings = omikujiData.displaySettings;
 const displaySize = ref<DisplaySize>(displaySettings.base.displaySize);
 const currentModeIndex = ref(0);

 // ランキングデータを保持する新しいrefを導入
 const currentRankings = ref<UserStatsType[]>([]);

 // 新しく「コンポーネントを選択するcomputed」を追加
 const selectedComponent = computed(() => {
  return displaySettings.developer.selectComponent;
 });

 // 有効なscriptKey配列を動的に構築（コンポーネント選択に基づいて変更）
 const availableScriptKeys = computed((): (string | null)[] => {
  const keys: (string | null)[] = [];

  // omikujiBotモードの場合、BOTちゃんモードのみ
  keys.push(null);
  // gameScriptモードの場合、アクティブなゲームスクリプトのみ
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

 // currentScriptKeyが変更されたときに、対応するランキングデータを更新する
 watch(
  currentScriptKey,
  (newKey) => {
   if (newKey) {
    currentRankings.value = scriptManager.getRankingData(newKey) || [];
   } else {
    currentRankings.value = [];
   }
  },
  { immediate: true }
 );

 // 現在のゲームスクリプトの設定情報（修復版 - 明示的にpropsを構築）
 const currentScriptGameProps = computed((): ScriptComponentPropsType => {
  const scriptKey = currentScriptKey.value;

  if (!scriptKey || !scriptGameMap[scriptKey]) {
   return {
    componentConfig: null,
    settings: {},
    userRankings: [],
    displaySize: displaySize.value
   };
  }

  // 明示的にpropsを構築してv-bindバグを回避
  const props: ScriptComponentPropsType = {
   componentConfig: scriptGameMap[scriptKey].componentConfig,
   settings: omikujiData.scriptSettings?.[scriptKey] || {},
   userRankings: currentRankings.value,
   displaySize: displaySize.value
  };

  return props;
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

 // forceUpdateは不要になりましたが、外部から強制更新が必要な場合に備えて残します
 const forceUpdate = () => {
  // この関数が呼ばれたときに、現在のscriptKeyのランキングデータを再取得する
  const key = currentScriptKey.value;
  if (key) {
   currentRankings.value = scriptManager.getRankingData(key) || [];
  } else {
   currentRankings.value = [];
  }
 };

 // 初期化処理（コンポーネント選択に対応）
 const initialize = () => {
  // displaySizeをsettingsから初期化
  displaySize.value = displaySettings.base.displaySize;

  // selectComponentに基づいて初期モードを設定
  if (selectedComponent.value === 'omikujiBot') {
   // omikujiBotモードの場合、BOTちゃんモードに設定
   switchToMode(null);
  } else if (selectedComponent.value === 'gameScript') {
   // gameScriptモードの場合、defaultScriptKeyまたは最初のアクティブスクリプトに設定
   const defaultKey = displaySettings.developer.defaultScriptKey;
   const activeScripts = scriptManager.getActiveScripts();

   if (defaultKey && activeScripts.includes(defaultKey)) {
    switchToMode(defaultKey);
   } else if (activeScripts.length > 0) {
    switchToMode(activeScripts[0]);
   }
  }
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
   availableScriptKeys: keys,
   selectedComponent: selectedComponent.value
  };
 };

 // ライフサイクル
 onMounted(() => {
  initialize();
 });

 return {
  // 状態
  currentScriptKey,
  currentScriptGameProps,
  scriptGameMap,
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
