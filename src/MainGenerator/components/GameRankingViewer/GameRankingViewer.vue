<!-- src/MainGenerator/components/GameRankingViewer/GameRankingViewer.vue -->
<template>
 <div v-if="props.componentConfig">
  <!-- Score Display with Animation -->
  <GameRankingScore
   v-if="scoreDisplay.isVisible.value"
   :player-data="props.userRankings[0]"
   :theme="theme"
   :size-config="sizeConfig"
  />

  <!-- Ranking Display -->
  <div :class="['p-1', theme.backgrounds.base, theme.fontStyles.rankingText]">
   <!-- ランキングタイトル -->
   <div
    :class="[
     'text-center mb-2 font-bold drop-shadow-lg',
     theme.textColors.accent,
     sizeConfig.text.large
    ]"
   >
    {{ theme.displaySettings.titleText }}
   </div>

   <!-- ランキングリスト -->
   <div class="overflow-hidden max-h-fit">
    <ul class="list-none p-0 m-0 space-y-1">
     <li
      v-for="(player, index) in props.userRankings"
      :key="index"
      :class="getRankingRowClass(index)"
     >
      <!-- 順位 -->
      <span :class="getRankingNumberClass(index, sizeConfig.rankingNumber)">
       {{ player.rank ?? index + 1 }}
      </span>

      <!-- プレイヤー情報 -->
      <span class="flex justify-center items-center flex-1">
       <span :class="['font-bold mr-2 text-white', sizeConfig.text.medium]">
        {{ player.points ?? 0 }} pt
       </span>
       <span :class="[theme.textColors.primary, sizeConfig.text.medium]">
        ({{ player.name }})
       </span>
      </span>
     </li>
    </ul>
   </div>

   <!-- 平均スコア -->
   <div
    :class="[
     'p-0 m-0 flex justify-center items-center w-full mt-2',
     theme.textColors.primary,
     sizeConfig.text.small
    ]"
   >
    平均: {{ gameStatistics.averageScore }}pt ({{ gameStatistics.totalCount }}回 / 総計{{
     gameStatistics.totalScore
    }}pt)
   </div>

   <!-- スコアテンプレート表示（処理前） -->
   <div :class="['text-center mt-1', theme.textColors.secondary, sizeConfig.text.small]">
    表示テンプレート: {{ theme.displaySettings.scoreFormat }}
   </div>
  </div>

  <!-- デバッグ用 -->
  <TailwindDebugComponent v-show="0" />
 </div>

 <!-- componentConfigがnullの場合はエラー表示 -->
 <div v-else class="p-4 bg-red-100 border border-red-400 rounded">
  <p class="text-red-700">設定が読み込まれていません</p>
 </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { ScriptComponentPropsType } from '@/types/';
import { COMPONENT_SIZE_CONFIG } from '@/MainGenerator/components/GameRankingViewer/useComponentConfig';
import { useDelayedDisplay } from '@/MainGenerator/components/GameRankingViewer/useDelayedDisplay';
import { useGameRanking } from './useGameRanking';
import GameRankingScore from './GameRankingScore.vue';
import TailwindDebugComponent from './TailwindDebugComponent.vue';

const props = defineProps<ScriptComponentPropsType>();
/*
 type ScriptComponentPropsType = {
 componentConfig: GameComponentConfig | null;
 settings: DefaultTypes;
 userRankings: UserStatsType[];
 displaySize: DisplaySize;
};
 */

// Score display control
const scoreDisplay = useDelayedDisplay(() => props.userRankings, {
 delayMs: 4500,
 displayMs: 5000
});

// Size configuration
const sizeConfig = computed(() => COMPONENT_SIZE_CONFIG[props.displaySize]);

//
const theme = computed(() => (props.componentConfig ? props.componentConfig : null));

// ゲームランキングコンポーザブル
const { gameStatistics, getRankingNumberClass, getRankingRowClass } = useGameRanking(
 props.userRankings,
 props.componentConfig
);
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=RocknRoll+One&family=Mochiy+Pop+P+One&display=swap');

.font-rocknroll {
 font-family: 'RocknRoll One', cursive;
 text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
}

.font-mochiy {
 font-family: 'Mochiy Pop P One', cursive;
}
</style>
