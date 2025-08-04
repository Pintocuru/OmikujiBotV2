// src/composables/useDisplayMode.ts
import { ref, computed, onMounted, watch, nextTick } from 'vue';
import { OmikujiDataType, ScriptComponentPropsType, UserStatsType } from '@/types/';
import { DisplaySize } from '@shared/types';
import { scriptGameMap } from '@/ScriptGame/ScriptGameMap';
import { GameScriptManager } from '@/MainGenerator/omikujiProcess/GameScriptManager';

export function useDisplayMode(omikujiData: OmikujiDataType, scriptManager: GameScriptManager) {
 const displaySettings = omikujiData.displaySettings;
 const displaySize = ref<DisplaySize>(displaySettings.base.displaySize);
 const currentModeIndex = ref(0);

 // 強制更新用のトリガー（数値を変更するだけでリアクティブに更新される）
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

 // ランキングデータを取得する関数（毎回新しいデータを取得）
 const getCurrentRankings = (scriptKey: string | null): UserStatsType[] => {
  if (!scriptKey) return [];

  try {
   // 毎回scriptManagerから最新のデータを取得
   const rankings = scriptManager.getRankingData(scriptKey);
   return rankings ? [...rankings] : []; // 配列を複製して返す
  } catch (error) {
   console.warn(`Failed to get rankings for ${scriptKey}:`, error);
   return [];
  }
 };

 // 現在のゲームスクリプトの設定情報（updateTriggerに依存させて強制更新対応）
 const currentScriptGameProps = computed((): ScriptComponentPropsType => {
  // updateTriggerを参照することで強制更新に対応
  updateTrigger.value; // eslint-disable-line no-unused-expressions

  const scriptKey = currentScriptKey.value;
  const componentKey = scriptKey ? `game-${scriptKey}` : 'bot-mode';

  if (!scriptKey || !scriptGameMap[scriptKey]) {
   return {
    componentKey: componentKey,
    componentConfig: null,
    settings: {},
    userRankings: [],
    displaySize: displaySize.value
   };
  }

  // 毎回新しいpropsオブジェクトを作成
  const props: ScriptComponentPropsType = {
   componentKey: componentKey, //new Date().getTime().toString(),
   componentConfig: scriptGameMap[scriptKey].componentConfig,
   settings: { ...(omikujiData.scriptSettings?.[scriptKey] || {}) }, // オブジェクトを複製
   userRankings: getCurrentRankings(scriptKey), // 毎回新しいランキングデータを取得
   displaySize: displaySize.value
  };

  return props;
 });

 // 特定のモードに直接切り替え
 const switchToMode = async (scriptKey: string | null) => {
  const keys = availableScriptKeys.value;
  const targetIndex = keys.findIndex((key) => key === scriptKey);

  if (targetIndex !== -1) {
   currentModeIndex.value = targetIndex;
   // 切り替え後に強制更新
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

 // 表示サイズ変更
 const setDisplaySize = (size: DisplaySize) => {
  displaySize.value = size;
  // サイズ変更時も強制更新
  forceUpdate();
 };

 // 強制更新（updateTriggerを変更してcomputedを再計算させる）
 const forceUpdate = () => {
  updateTrigger.value += 1;
 };

 // 初期化処理
 const initialize = () => {
  // displaySizeを設定から初期化
  displaySize.value = displaySettings.base.displaySize;

  // selectComponentに基づいて初期モードを設定
  if (selectedComponent.value === 'omikujiBot') {
   // omikujiBotモードの場合、BOTちゃんモードに設定
   currentModeIndex.value = 0; // null (BOTモード) は常にindex 0
  } else if (selectedComponent.value === 'gameScript') {
   // gameScriptモードの場合、defaultScriptKeyまたは最初のアクティブスクリプトに設定
   const defaultKey = displaySettings.developer.defaultScriptKey;
   const activeScripts = scriptManager.getActiveScripts();

   if (defaultKey && activeScripts.includes(defaultKey)) {
    const keys = availableScriptKeys.value;
    const targetIndex = keys.findIndex((key) => key === defaultKey);
    if (targetIndex !== -1) {
     currentModeIndex.value = targetIndex;
    }
   } else if (activeScripts.length > 0) {
    currentModeIndex.value = 1; // BOTモード(index 0)の次がゲームスクリプト
   }
  }

  // 初期化後に強制更新
  forceUpdate();
 };

 // 設定情報を取得
 const getDisplaySettings = () => {
  return {
   ...displaySettings,
   currentDisplaySize: displaySize.value
  };
 };

 // 現在のモード情報を取得
 const getCurrentModeInfo = () => {
  const keys = availableScriptKeys.value;
  return {
   currentIndex: currentModeIndex.value,
   totalModes: keys.length,
   currentScriptKey: currentScriptKey.value,
   availableScriptKeys: [...keys], // 配列を複製
   selectedComponent: selectedComponent.value
  };
 };

 // currentScriptKeyが変更されたときに自動で更新
 watch(
  currentScriptKey,
  () => {
   // scriptKeyが変更されたら強制更新
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
