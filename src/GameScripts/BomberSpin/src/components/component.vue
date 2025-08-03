<!-- components/component.vue -->
<template>
 <!-- Score Display with Explosion Effect -->
 <div
  v-if="scoreDisplay.isVisible.value"
  class="relative mx-auto whitespace-nowrap flex flex-col justify-center items-center -mb-8"
 >
  <!-- Explosion Effect Background -->
  <div
   :class="[
    'absolute inset-0 explosion-container flex items-center justify-center',
    sizeConfig.explosionText
   ]"
  >
   💥
  </div>

  <!-- Main Content -->
  <div class="absolute inset-0 flex flex-col items-center justify-center text-center z-10">
   <div :class="['font-bold text-yellow-400 font-rocknroll drop-shadow-lg', sizeConfig.text.large]">
    スコア
   </div>

   <div
    :class="['font-bold font-rocknroll text-yellow-400 drop-shadow-2xl', sizeConfig.text.xlarge]"
   >
    {{ gameStats.result.score }}
   </div>

   <div
    :class="['mt-2 font-bold text-yellow-400 font-rocknroll drop-shadow-lg', sizeConfig.text.large]"
   >
    {{ gameStats.result.name }}
   </div>
  </div>
 </div>

 <!-- Ranking Display -->
 <div
  class="bg-stone-800 bg-opacity-90 border-4 border-red-600 rounded-xl font-rocknroll backdrop-blur-sm p-1"
 >
  <div :class="['text-center mb-2 text-amber-300 font-bold drop-shadow-lg', sizeConfig.text.large]">
   💣 Bomber Slot Rankings 💥
  </div>

  <div class="overflow-hidden max-h-fit">
   <ul class="list-none p-0 m-0 space-y-1">
    <li
     v-for="(player, index) in gameStats.rankPlayers"
     :key="index"
     :class="getRankingClass(index)"
    >
     <!-- Ranking Number with Medal Colors -->
     <span :class="getRankingNumberClass((player.rank ?? 0) - 1)">
      {{ player.rank ?? 1 }}
     </span>

     <span class="flex justify-center items-center flex-1">
      <span :class="['font-bold mr-2 text-white', sizeConfig.text.medium]">
       {{ player.points }}
      </span>
      <span :class="['text-amber-300', sizeConfig.text.medium]"> ({{ player.name }}) </span>
     </span>
    </li>
   </ul>
  </div>

  <div
   :class="[
    'p-0 m-0 flex justify-center items-center w-full text-amber-300 mt-2',
    sizeConfig.text.small
   ]"
  >
   平均: {{ averagePoint }}pt ({{ gameStats.totalCount }}回 / 総計{{ gameStats.totalPoint }}pt)
  </div>
 </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { GameSettings } from '@/params';
import { COMPONENT_SIZE_CONFIG } from '@shared/utils/rankComponent/useComponentConfig';
import { useDelayedDisplay } from '@shared/utils/rankComponent/useDelayedDisplay';
import { ScriptComponentPropsType } from '@type/index';
import { SIZE_CONFIG } from './componentConfig';

const props = defineProps<ScriptComponentPropsType<GameSettings>>();

// Score bubble display control (using shared composable)
const scoreDisplay = useDelayedDisplay(() => props.userRankings, {
 delayMs: 3500, // Display start delay
 displayMs: 5000 // Display duration
});

// Size configuration
const sizeConfig = computed(() => COMPONENT_SIZE_CONFIG[props.displaySize]);

// Game statistics data
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

// Average score calculation
const averagePoint = computed(() => {
 const stats = gameStats.value;
 return stats.totalCount > 0 ? Math.round(stats.totalPoint / stats.totalCount) : 0;
});

// Ranking number class with medal colors (1st: Gold, 2nd: Silver, 3rd: Bronze, 4th+: Normal)
const getRankingNumberClass = (index: number) => {
 const sizeClass = sizeConfig.value.rankingNumber;
 const baseClass = `inline-block font-bold text-center rounded-full border mr-1 ${sizeClass}`;

 switch (index) {
  case 0: // 1st place - Gold
   return `${baseClass}  bg-gradient-to-r from-amber-300 to-orange-400 text-stone-800 border-amber-300`;
  case 1: // 2nd place - Silver
   return `${baseClass}  bg-gradient-to-r from-gray-300 to-gray-500 text-gray-800 border-gray-400`;
  case 2: // 3rd place - Bronze
   return `${baseClass}  bg-gradient-to-r from-orange-400 to-red-600 text-stone-800 border-orange-400`;
  default: // 4th+ place - Normal
   return `${baseClass}  bg-stone-800 text-amber-300 border-amber-300`;
 }
};

// Ranking row styling (alternating colors)
const getRankingClass = (index: number) => {
 const baseClass = 'flex items-center font-bold rounded-lg shadow-sm  p-1';
 const isOdd = index % 2 === 0; // 0-based index where 0 is 1st place (odd)

 if (isOdd) {
  // Odd rows (1st, 3rd, 5th...) - Red theme
  return `${baseClass} text-amber-300 bg-red-800 bg-opacity-70 border-amber-300`;
 } else {
  // Even rows (2nd, 4th, 6th...) - Stone theme
  return `${baseClass} text-amber-300 bg-stone-800 bg-opacity-70 border-orange-400`;
 }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=RocknRoll+One&family=Mochiy+Pop+P+One&display=swap');

.font-rocknroll {
 font-family: 'RocknRoll One', cursive;
 text-shadow: 3px 3px 6px rgba(0, 0, 0, 1);
}

/* Explosion effect container */
.explosion-container {
 position: relative;
 animation: explosion-bounce 1.4s ease-in-out infinite;
}

/* Intense bounce animation */
@keyframes explosion-bounce {
 0%,
 60%,
 100% {
  transform: scale(1);
 }
 15% {
  transform: scale(1.2);
 }
 30% {
  transform: scale(1.05);
 }
 45% {
  transform: scale(1.2);
 }
}
</style>
