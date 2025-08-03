<!-- [GouseiSuika] src/components/component.vue -->
<template>
 <!-- スコアバブル -->
 <div
  v-if="scoreDisplay.isVisible.value"
  :class="[
   'rounded-full mx-auto relative whitespace-nowrap flex flex-col justify-center items-center -mb-8',
   'bg-gradient-to-br from-blue-50 to-blue-100 shadow-2xl border-4 border-blue-200',
   'bubble-animation shadow-blue-200/50',
   sizeConfig.scoreCircle
  ]"
 >
  <div :class="['font-bold text-blue-900 font-rocknroll', sizeConfig.text.large]">スコア</div>
  <div
   :class="[
    'font-bold font-mochiy bg-gradient-to-b from-amber-300 to-amber-600 bg-clip-text text-transparent',
    sizeConfig.text.xlarge
   ]"
  >
   {{ gameStats.result.score }}
  </div>
  <div :class="['mt-2 font-bold text-blue-900 font-rocknroll', sizeConfig.text.large]">
   {{ gameStats.result.name }}
  </div>
 </div>

 <!-- ランキング表示 -->
 <div
  :class="[
   'bg-amber-50 border-4 border-amber-400 rounded-3xl font-rocknroll px-1',
   sizeConfig.container.padding
  ]"
 >
  <div :class="['text-center mb-2 text-amber-800 font-bold drop-shadow-lg', sizeConfig.text.large]">
   🍉スイカランキング🍉
  </div>

  <div class="overflow-hidden max-h-fit">
   <ul class="list-none p-0 m-0 space-y-1">
    <li
     v-for="(player, index) in gameStats.rankPlayers"
     :key="index"
     :class="getRankingClass((player.rank ?? 1) - 1)"
    >
     <!-- ランキング順位 -->
     <span
      :class="[
       'inline-block font-bold text-center rounded-full transform transition-all duration-300',
       getRankNumberClass((player.rank ?? 1) - 1),
       sizeConfig.rankingNumber
      ]"
     >
      {{ player.rank ?? 1 }}
     </span>

     <!-- スコアと名前 -->
     <span class="flex justify-center items-center flex-1">
      <span :class="['font-bold mr-2', sizeConfig.text.medium]">{{ player.points! }}</span>
      <span :class="['text-gray-600', sizeConfig.text.medium]">({{ player.name }})</span>
     </span>
    </li>
   </ul>
  </div>

  <!-- 統計情報 -->
  <div :class="['flex justify-center items-center w-full text-gray-600', sizeConfig.text.small]">
   平均: {{ averagePoint }}pt ({{ gameStats.totalCount }}回 / 総計{{ gameStats.totalPoint }}pt)
  </div>
 </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { GameSettings } from '@/params';
import { SIZE_CONFIG } from './componentConfig';
import { useDelayedDisplay } from '@shared/utils/rankComponent/useDelayedDisplay';
import { ScriptComponentPropsType } from '@shared/types/GameScriptTypes';

const props = defineProps<ScriptComponentPropsType<GameSettings>>();

// スコアバブル表示制御
const scoreDisplay = useDelayedDisplay(() => props.userRankings, {
 delayMs: 4500,
 displayMs: 5000
});

const sizeConfig = computed(() => SIZE_CONFIG[props.displaySize]);

// ゲーム統計データ
const gameStats = computed(() => {
 // 現在のプレイヤーを最上位に、残りをスコア降順でソート
 const currentPlayer = props.userRankings[0] || null;
 const otherPlayers = props.userRankings
  .slice(1)
  .sort((a, b) => (b?.points ?? 0) - (a?.points ?? 0));
 const displayPlayers = currentPlayer ? [currentPlayer, ...otherPlayers] : otherPlayers;

 return {
  showResult: !!currentPlayer,
  result: {
   score: currentPlayer?.points || 0,
   name: currentPlayer?.name || 'プレイヤー'
  },
  rankPlayers: displayPlayers.slice(0, props.settings.rankingLimit),
  totalCount: props.userRankings.length,
  totalPoint: props.userRankings.reduce((sum, player) => sum + (player?.points ?? 0), 0)
 };
});

// 平均スコア
const averagePoint = computed(() => {
 const { totalCount, totalPoint } = gameStats.value;
 return totalCount > 0 ? Math.round(totalPoint / totalCount) : 0;
});

// ランキング順位のスタイル（上位3位は特別デザイン）
const getRankNumberClass = (rankIndex: number) => {
 const classes = [
  'bg-gradient-to-br from-yellow-300 via-yellow-400 to-yellow-600 text-yellow-900 border-yellow-500 shadow-yellow-400/50', // 1位
  'bg-gradient-to-br from-gray-300 via-gray-400 to-gray-600 text-gray-900 border-gray-500 shadow-gray-400/50', // 2位
  'bg-gradient-to-br from-orange-300 via-orange-400 to-orange-600 text-orange-900 border-orange-500 shadow-orange-400/50' // 3位
 ];

 return rankIndex < 3
  ? `${classes[rankIndex]} shadow-lg`
  : 'bg-gray-200 text-gray-700 border-gray-300';
};

// ランキング行のスタイル
const getRankingClass = (rankIndex: number) => {
 const baseClass = `flex items-center font-bold rounded-lg shadow-sm px-1 ${sizeConfig.value.container.itemPadding}`;
 const rankStyles = [
  'text-amber-800 bg-gradient-to-r from-amber-200 to-amber-100 border-l-4 border-amber-400', // 1位
  'text-blue-800 bg-gradient-to-r from-blue-200 to-blue-100 border-l-4 border-blue-400', // 2位
  'text-orange-800 bg-gradient-to-r from-orange-200 to-orange-100 border-l-4 border-orange-400' // 3位
 ];

 const rankStyle =
  rankIndex < 3
   ? rankStyles[rankIndex]
   : 'text-gray-700 bg-gradient-to-r from-gray-100 to-gray-50 border-l-4 border-gray-300';

 return `${baseClass} ${rankStyle}`;
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=RocknRoll+One&family=Mochiy+Pop+P+One&display=swap');

.font-rocknroll {
 font-family: 'RocknRoll One', cursive;
}

.font-mochiy {
 font-family: 'Mochiy Pop P One', cursive;
}

.bubble-animation {
 animation: bubble-float 3s ease-in-out infinite;
 transform: translateY(-5px);
 transition: all 0.3s ease-in-out;
}

@keyframes bubble-float {
 0%,
 100% {
  transform: translateY(-5px);
 }
 50% {
  transform: translateY(-15px);
 }
}
</style>
