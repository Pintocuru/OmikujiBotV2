// src/composables/useDisplayMode.ts
import { ref, computed, onMounted, nextTick } from 'vue';
import { OmikujiDataType, ScriptComponentPropsType, UserStatsType } from '@/types/';
import { DisplaySize } from '@shared/types';
import { scriptGameMap } from '@/ScriptGame/ScriptGameMap';
import { GameScriptManager } from '@/MainGenerator/omikujiProcess/GameScriptManager';

export function useDisplayMode(omikujiData: OmikujiDataType, scriptManager: GameScriptManager) {
 const displaySettings = omikujiData.displaySettings;
 const displaySize = ref<DisplaySize>(displaySettings.base.displaySize);
 const currentModeIndex = ref(0);

 // 各scriptKey専用のランキングデータキャッシュ
 const rankingCache = ref<Map<string, { data: UserStatsType[]; timestamp: number }>>(new Map());

 // 強制更新用のタイムスタンプ
 const lastUpdateTime = ref<number>(Date.now());

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

 // 特定のscriptKeyのランキングデータを取得（キャッシュ機能付き）
 const getRankingDataForScript = (scriptKey: string): UserStatsType[] => {
  if (!scriptKey) return [];

  try {
   // scriptManagerから最新データを取得
   const freshData = scriptManager.getRankingData(scriptKey);

   console.log(`[getRankingDataForScript] Raw data from scriptManager for ${scriptKey}:`, {
    scriptKey,
    freshData,
    dataReference: freshData,
    isNull: freshData === null,
    isUndefined: freshData === undefined,
    length: freshData?.length || 0,
    stringified: JSON.stringify(freshData)
   });

   if (!freshData) return [];

   // 完全に新しい配列として複製（深いコピー）
   const clonedData: UserStatsType[] = freshData.map((item, index) => {
    const cloned = {
     ...item
     // オブジェクトのプロパティも複製する場合は以下を追加
     // stats: { ...item.stats }, // 例: statsプロパティがある場合
    };

    console.log(`[getRankingDataForScript] Cloning item ${index} for ${scriptKey}:`, {
     original: item,
     cloned: cloned,
     isSameReference: item === cloned
    });

    return cloned;
   });

   console.log(`[getRankingDataForScript] Final cloned data for ${scriptKey}:`, {
    scriptKey,
    clonedData,
    originalReference: freshData,
    clonedReference: clonedData,
    isSameReference: freshData === clonedData
   });

   // キャッシュを更新
   rankingCache.value.set(scriptKey, {
    data: clonedData,
    timestamp: lastUpdateTime.value
   });

   return clonedData;
  } catch (error) {
   console.warn(`Failed to get rankings for ${scriptKey}:`, error);
   return [];
  }
 };

 // 現在のゲームスクリプトの設定情報
 const currentScriptGameProps = computed((): ScriptComponentPropsType => {
  const scriptKey = currentScriptKey.value;
  // lastUpdateTime を依存関係に含めることで強制更新に対応
  const updateTime = lastUpdateTime.value;

  if (!scriptKey || !scriptGameMap[scriptKey]) {
   return {
    componentKey: Date.now().toString(),
    componentConfig: null,
    settings: {},
    userRankings: [],
    displaySize: displaySize.value
   };
  }

  // 新しいpropsオブジェクトを毎回作成
  const props: ScriptComponentPropsType = {
   componentKey: Date.now().toString(),
   componentConfig: scriptGameMap[scriptKey].componentConfig,
   settings: JSON.parse(JSON.stringify(omikujiData.scriptSettings?.[scriptKey] || {})), // ディープクローン
   userRankings: getRankingDataForScript(scriptKey), // 専用関数で取得
   displaySize: displaySize.value
  };

  // デバッグログ
  console.log(`[useDisplayMode] Generated props for ${scriptKey}:`, {
   scriptKey,
   updateTime,
   rankingsCount: props.userRankings.length,
   rankings: props.userRankings
  });

  return props;
 });

 // 特定のモードに直接切り替え
 const switchToMode = async (scriptKey: string | null) => {
  const keys = availableScriptKeys.value;
  const targetIndex = keys.findIndex((key) => key === scriptKey);

  if (targetIndex !== -1) {
   console.log(`[useDisplayMode] Switching to mode: ${scriptKey}`);
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
  forceUpdate();
 };

 // 強制更新（タイムスタンプを更新してcomputedを再計算させる）
 const forceUpdate = () => {
  const now = Date.now();
  console.log(`[useDisplayMode] Force update triggered: ${now}`);

  // キャッシュをクリア
  rankingCache.value.clear();

  // タイムスタンプを更新
  lastUpdateTime.value = now;
 };

 // 特定のscriptKeyのキャッシュのみクリア
 const clearCacheForScript = (scriptKey: string) => {
  rankingCache.value.delete(scriptKey);
  lastUpdateTime.value = Date.now();
 };

 // 全てのキャッシュをクリア
 const clearAllCache = () => {
  rankingCache.value.clear();
  lastUpdateTime.value = Date.now();
 };

 // 初期化処理
 const initialize = () => {
  displaySize.value = displaySettings.base.displaySize;

  if (selectedComponent.value === 'omikujiBot') {
   currentModeIndex.value = 0; // BOTモード
  } else if (selectedComponent.value === 'gameScript') {
   const defaultKey = displaySettings.developer.defaultScriptKey;
   const activeScripts = scriptManager.getActiveScripts();

   if (defaultKey && activeScripts.includes(defaultKey)) {
    const keys = availableScriptKeys.value;
    const targetIndex = keys.findIndex((key) => key === defaultKey);
    if (targetIndex !== -1) {
     currentModeIndex.value = targetIndex;
    }
   } else if (activeScripts.length > 0) {
    currentModeIndex.value = 1; // 最初のゲームスクリプト
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
   availableScriptKeys: [...keys],
   selectedComponent: selectedComponent.value,
   lastUpdateTime: lastUpdateTime.value,
   cacheStatus: Object.fromEntries(rankingCache.value)
  };
 };

 // デバッグ用: 現在のキャッシュ状態を取得
 const getCacheDebugInfo = () => {
  const info: Record<string, any> = {};
  rankingCache.value.forEach((value, key) => {
   info[key] = {
    timestamp: value.timestamp,
    dataCount: value.data.length,
    sampleData: value.data.slice(0, 2) // 最初の2件のみ表示
   };
  });
  return info;
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
  clearCacheForScript,
  clearAllCache,

  // 設定取得
  getDisplaySettings,
  getCurrentModeInfo,
  getCacheDebugInfo
 };
}
