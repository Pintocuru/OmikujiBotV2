// src/composables/useDisplayScriptProps.ts
import { computed } from 'vue';
import { OmikujiDataType, ScriptComponentPropsType, UserStatsType } from '@/types/';
import { DisplaySize } from '@shared/types';
import { scriptGameMap } from '@/ScriptGame/ScriptGameMap';
import { GameScriptManager } from '@/MainGenerator/omikujiProcess/GameScriptManager';

export function useDisplayScriptProps(
 omikujiData: OmikujiDataType,
 scriptManager: GameScriptManager,
 currentScriptKey: { value: string | null },
 displaySize: { value: DisplaySize },
 updateTrigger: { value: number }
) {
 // ランキングデータを取得する関数
 const getCurrentRankings = (scriptKey: string | null): UserStatsType[] => {
  if (!scriptKey) return [];

  try {
   const rankings = scriptManager.getRankingData(scriptKey);
   return rankings ? [...rankings] : [];
  } catch (error) {
   console.warn(`Failed to get rankings for ${scriptKey}:`, error);
   return [];
  }
 };

 // 現在のゲームスクリプトの設定情報
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

  const props: ScriptComponentPropsType = {
   componentKey: componentKey,
   componentConfig: scriptGameMap[scriptKey].componentConfig,
   settings: { ...(omikujiData.scriptSettings?.[scriptKey] || {}) },
   userRankings: getCurrentRankings(scriptKey),
   displaySize: displaySize.value
  };

  return props;
 });

 return {
  currentScriptGameProps,
  scriptGameMap
 };
}
