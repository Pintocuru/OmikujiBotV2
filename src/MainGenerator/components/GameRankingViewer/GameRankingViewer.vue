<!-- GameScripts/DwarfBomb/src/components/GameRankingViewer.vue -->
<template>
 <!-- componentConfigがnullの場合はエラー表示 -->
 <div v-if="!props.componentConfig" class="p-4 bg-red-100 border border-red-400 rounded">
  <p class="text-red-700">設定が読み込まれていません</p>
 </div>

 <!-- 正常な場合の表示 -->
 <div v-else>
  <!-- Score Display with Animation -->
  <GameRankingScore
   v-if="scoreDisplay.isVisible.value"
   :player-data="props.userRankings[0]"
   :theme="theme"
   :size-config="sizeConfig"
  />

  <!-- Ranking Display -->
  <div :class="['p-1', theme.background.container, theme.fontClass.rankingDisplay]">
   <div
    :class="['text-center mb-2 font-bold drop-shadow-lg', theme.text.accent, sizeConfig.text.large]"
   >
    {{ props.componentConfig.rankingTitle }}
   </div>

   <div class="overflow-hidden max-h-fit">
    <ul class="list-none p-0 m-0 space-y-1">
     <li
      v-for="(player, index) in props.userRankings"
      :key="index"
      :class="getRankingRowClass(index)"
     >
      <!-- Ranking Number with Medal Colors -->
      <span :class="getRankingNumberClass(index, sizeConfig.rankingNumber)">
       {{ player.rank ?? index + 1 }}
      </span>

      <span class="flex justify-center items-center flex-1">
       <span :class="['font-bold mr-2 text-white', sizeConfig.text.medium]">
        {{ player.points ?? 0 }} pt
       </span>
       <span :class="[theme.text.primary, sizeConfig.text.medium]"> ({{ player.name }}) </span>
      </span>
     </li>
    </ul>
   </div>

   <div
    :class="[
     'p-0 m-0 flex justify-center items-center w-full mt-2',
     theme.text.primary,
     sizeConfig.text.small
    ]"
   >
    平均: {{ gameStatistics.averageScore }}pt ({{ gameStatistics.totalCount }}回 / 総計{{
     gameStatistics.totalScore
    }}pt)
   </div>
  </div>
  <!-- 表示テスト -->
  <TailwindDebugComponent v-show="0" />
 </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { COMPONENT_SIZE_CONFIG } from '@/MainGenerator/components/GameRankingViewer/useComponentConfig';
import { useDelayedDisplay } from '@/MainGenerator/components/GameRankingViewer/useDelayedDisplay';
import { useGameRanking } from './useGameRanking';
import { getTheme } from './ThemePresets';
import GameRankingScore from './GameRankingScore.vue';
import TailwindDebugComponent from './TailwindDebugComponent.vue';
import { ScriptComponentPropsType } from '@type/';

const props = defineProps<ScriptComponentPropsType>();

// Score display control
const scoreDisplay = useDelayedDisplay(() => props.userRankings, {
 delayMs: 4500,
 displayMs: 5000
});

// Size configuration
const sizeConfig = computed(() => COMPONENT_SIZE_CONFIG[props.displaySize]);

// テーマをキー名で取得（null チェック付き）
const theme = computed(() => {
 if (!props.componentConfig) {
  console.warn('componentConfig is null, using default theme');
  return getTheme('ocean'); // デフォルトテーマ
 }

 console.log('Getting theme for:', props.componentConfig.themeName);
 const selectedTheme = getTheme(props.componentConfig.themeName);
 console.log('Selected theme:', selectedTheme);
 return selectedTheme;
});

// ゲームランキングコンポーザブルを使用（null チェック付き）
const { gameStatistics, getRankingNumberClass, getRankingRowClass } = useGameRanking(
 props.userRankings,
 props.componentConfig || {
  rankingTitle: 'ランキング',
  themeName: 'ocean',
  useRankingBackgrounds: true
 }
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
