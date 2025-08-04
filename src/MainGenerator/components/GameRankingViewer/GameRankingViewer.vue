<!-- src/MainGenerator/components/GameRankingViewer/GameRankingViewer.vue -->
<template>
 <div v-if="theme">
  <!-- Score Display with Animation -->
  <GameRankingScore
   v-if="scoreDisplay.isVisible.value && userRankings.length > 0"
   :player-data="userRankings[0]"
   :theme="theme"
   :size-config="sizeConfig"
   :score-display="theme.scoreDisplay"
  />

  <!-- Ranking list -->
  <GameRankingList
   :user-rankings="userRankings"
   :theme="theme"
   :size-config="sizeConfig"
   :game-statistics="gameStatistics"
   :format-player-info="formatPlayerInfo"
   :get-ranking-row-class="getRankingRowClass"
   :get-ranking-number-class="getRankingNumberClass"
  />

  <!-- デバッグ用 -->
  <Dev />
 </div>

 <!-- componentConfigがnullの場合はエラー表示 -->
 <div v-else class="p-4 bg-red-100 border border-red-400 rounded">
  <p class="text-red-700">設定が読み込まれていません</p>
  <p class="text-red-600 text-sm mt-1">
   componentConfig: {{ props.componentConfig ? 'loaded' : 'null' }}
  </p>
 </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { ScriptComponentPropsType } from '@/types/';
import { COMPONENT_SIZE_CONFIG } from '@/MainGenerator/components/GameRankingViewer/useComponentConfig';
import { useDelayedDisplay } from '@/MainGenerator/components/GameRankingViewer/useDelayedDisplay';
import { useGameRanking } from './useGameRanking';
import GameRankingScore from './GameRankingScore.vue';
import GameRankingList from './GameRankingList.vue';
import Dev from './Dev.vue';

const props = defineProps<ScriptComponentPropsType>();
/**
 type ScriptComponentPropsType = {
 componentConfig: GameComponentConfig | null;
 settings: DefaultTypes;
 userRankings: UserStatsType[];
 displaySize: DisplaySize;
};
 */

// Score display control
const scoreDisplay = useDelayedDisplay(() => props.userRankings || [], {
 delayMs: 4500,
 displayMs: 9995000
});

// Size configuration
const sizeConfig = computed(() => COMPONENT_SIZE_CONFIG[props.displaySize]);

// Null安全なtheme
const theme = computed(() => {
 return props.componentConfig ?? null;
});

// ゲームランキングコンポーザブル
const {
 gameStatistics,
 userRankings,
 formatPlayerInfo,
 getRankingRowClass,
 getRankingNumberClass
} = useGameRanking(props.userRankings || [], props.componentConfig);
</script>
