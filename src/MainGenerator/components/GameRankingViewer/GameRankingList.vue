<!-- src/MainGenerator/components/GameRankingViewer/GameRankingList.vue -->
<template>
 <div
  v-if="displayStore.currentComponentConfig"
  :class="[
   'p-1 rounded-2xl',
   displayStore.currentComponentConfig.backgrounds.base,
   displayStore.currentComponentConfig.fontStyles.rankingText
  ]"
 >
  <!-- ランキングタイトル -->
  <div
   :class="[
    'text-center mb-2 font-bold drop-shadow-lg',
    displayStore.currentComponentConfig.textColors.accent,
    sizeConfig.text.large
   ]"
  >
   {{ displayStore.currentComponentConfig.displaySettings.titleText }}
  </div>

  <!-- ランキングリスト -->
  <div class="overflow-hidden max-h-fit">
   <ul class="list-none p-0 m-0 space-y-1">
    <li
     v-for="(player, index) in displayStore.currentUserRankings"
     :key="`${player.userId}-${index}`"
     :class="getRankingRowClass(index)"
    >
     <!-- 順位 -->
     <span :class="getRankingNumberClass(index, sizeConfig.rankingNumber)">
      {{ player.rank ?? index + 1 }}
     </span>

     <!-- プレイヤー情報 -->
     <span class="flex justify-center items-center flex-1">
      <span
       class="font-bold drop-shadow-lg"
       :class="[displayStore.currentComponentConfig.textColors.primary, sizeConfig.text.medium]"
       v-html="
        formatPlayerInfo(player, displayStore.currentComponentConfig.displaySettings.scoreFormat)
       "
      />
     </span>
    </li>
   </ul>
  </div>

  <!-- 平均スコア -->
  <div
   :class="[
    'p-0 m-0 flex justify-center items-center w-full mt-2',
    displayStore.currentComponentConfig.textColors.primary,
    sizeConfig.text.small
   ]"
  >
   平均: {{ gameStatistics.averageScore }}pt ({{ gameStatistics.totalCount }}回 / 総計{{
    gameStatistics.totalScore
   }}pt)
  </div>

  <!-- スコアテンプレート表示（処理前） -->
  <div
   :class="[
    'text-center mt-1',
    displayStore.currentComponentConfig.textColors.secondary,
    sizeConfig.text.small
   ]"
  ></div>
 </div>

 <!-- データがない場合 -->
 <div v-else class="p-4 bg-red-100 border border-red-400 rounded">
  <p class="text-red-700">テーマ設定が読み込まれていません</p>
 </div>
</template>

<script setup lang="ts">
import { SizeConfig } from './useComponentConfig';
import { useDisplayStore } from '@/MainGenerator/stores';
import { useGameRanking } from './useGameRanking';

// Props
defineProps<{
 sizeConfig: SizeConfig;
}>();

// Piniaストアの使用
const displayStore = useDisplayStore();

// ゲームランキングコンポーザブル
const { gameStatistics, formatPlayerInfo, getRankingRowClass, getRankingNumberClass } =
 useGameRanking();
</script>
