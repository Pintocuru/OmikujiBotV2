<!-- TailwindDebugComponent.vue -->
<template>
 <div class="p-4 space-y-4">
  <h2 class="text-xl font-bold text-gray-800">TailwindCSS デバッグテスト</h2>

  <!-- 基本的なTailwindクラスのテスト -->
  <div class="space-y-2">
   <h3 class="text-lg font-semibold">基本クラステスト</h3>
   <div class="bg-red-500 text-white p-2 rounded">赤背景（bg-red-500）</div>
   <div class="bg-blue-500 text-white p-2 rounded">青背景（bg-blue-500）</div>
   <div class="bg-green-500 text-white p-2 rounded">緑背景（bg-green-500）</div>
  </div>

  <!-- グラデーションクラスのテスト -->
  <div class="space-y-2">
   <h3 class="text-lg font-semibold">グラデーションテスト</h3>
   <div class="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-2 rounded">
    基本グラデーション（from-blue-500 to-purple-600）
   </div>
   <div class="bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white p-2 rounded">
    Ocean テーマコンテナ（from-blue-900 via-blue-800 to-indigo-900）
   </div>
   <div class="bg-gradient-to-r from-yellow-400 via-yellow-500 to-amber-500 text-black p-2 rounded">
    1位背景（from-yellow-400 via-yellow-500 to-amber-500）
   </div>
  </div>

  <!-- 透明度クラスのテスト -->
  <div class="space-y-2">
   <h3 class="text-lg font-semibold">透明度テスト</h3>
   <div class="bg-blue-800 bg-opacity-40 text-white p-2 rounded">
    奇数行（bg-blue-800 bg-opacity-40）
   </div>
   <div class="bg-blue-700 bg-opacity-50 text-white p-2 rounded">
    偶数行（bg-blue-700 bg-opacity-50）
   </div>
  </div>

  <!-- 現在のテーマの確認 -->
  <div class="space-y-2">
   <h3 class="text-lg font-semibold">現在のテーマテスト</h3>
   <div :class="['p-4 rounded', currentTheme.background.container]">
    <div :class="['text-center mb-2', currentTheme.text.accent]">
     テーマコンテナ（{{ themeName }}）
    </div>
    <div :class="['p-2 rounded mb-2', currentTheme.background.ranking.first]">1位背景</div>
    <div :class="['p-2 rounded mb-2', currentTheme.background.ranking.second]">2位背景</div>
    <div :class="['p-2 rounded mb-2', currentTheme.background.ranking.third]">3位背景</div>
    <div :class="['p-2 rounded mb-2', currentTheme.background.ranking.oddRow]">奇数行背景</div>
    <div :class="['p-2 rounded', currentTheme.background.ranking.evenRow]">偶数行背景</div>
   </div>
  </div>

  <!-- クラス情報の表示 -->
  <div class="space-y-2">
   <h3 class="text-lg font-semibold">クラス情報</h3>
   <pre class="bg-gray-100 p-2 rounded text-sm overflow-auto">{{
    JSON.stringify(currentTheme, null, 2)
   }}</pre>
  </div>

  <!-- テーマ切り替えボタン -->
  <div class="space-y-2">
   <h3 class="text-lg font-semibold">テーマ切り替え</h3>
   <div class="flex flex-wrap gap-2">
    <button
     v-for="theme in availableThemes"
     :key="theme"
     @click="themeName = theme"
     :class="[
      'px-3 py-1 rounded',
      themeName === theme ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'
     ]"
    >
     {{ theme }}
    </button>
   </div>
  </div>
 </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { getTheme, getAvailableThemes, GameRankingThemeLabel } from './ThemePresets';

const themeName = ref<GameRankingThemeLabel>('ocean');
const availableThemes = getAvailableThemes();

const currentTheme = computed(() => {
 console.log('Debug component getting theme:', themeName.value);
 return getTheme(themeName.value);
});

// Ocean Theme Classes
const OCEAN_CLASSES = {
 container: 'bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900',
 textPrimary: 'text-blue-100',
 textSecondary: 'text-blue-200',
 textAccent: 'text-cyan-300',
 rankingFirst: 'bg-gradient-to-r from-yellow-400 via-yellow-500 to-amber-500',
 rankingSecond: 'bg-gradient-to-r from-gray-300 via-gray-400 to-gray-500',
 rankingThird: 'bg-gradient-to-r from-amber-600 via-amber-700 to-orange-600',
 rankingOdd: 'bg-blue-800 bg-opacity-40',
 rankingEven: 'bg-blue-700 bg-opacity-50'
} as const;

// Cave Mining Theme Classes
const CAVE_MINING_CLASSES = {
 container: 'bg-gradient-to-br from-stone-900 via-gray-800 to-amber-900',
 textPrimary: 'text-amber-100',
 textSecondary: 'text-amber-200',
 textAccent: 'text-orange-300',
 rankingFirst: 'bg-gradient-to-r from-yellow-400 via-yellow-500 to-amber-500',
 rankingSecond: 'bg-gradient-to-r from-gray-300 via-gray-400 to-gray-500',
 rankingThird: 'bg-gradient-to-r from-amber-600 via-amber-700 to-orange-600',
 rankingOdd: 'bg-stone-800 bg-opacity-40',
 rankingEven: 'bg-stone-700 bg-opacity-50'
} as const;

// Gousei Suika Theme Classes
const GOUSEI_SUIKA_CLASSES = {
 container: 'bg-gradient-to-br from-green-900 via-emerald-800 to-teal-900',
 textPrimary: 'text-green-100',
 textSecondary: 'text-green-200',
 textAccent: 'text-lime-300',
 rankingFirst: 'bg-gradient-to-r from-yellow-400 via-yellow-500 to-amber-500',
 rankingSecond: 'bg-gradient-to-r from-gray-300 via-gray-400 to-gray-500',
 rankingThird: 'bg-gradient-to-r from-amber-600 via-amber-700 to-orange-600',
 rankingOdd: 'bg-green-800 bg-opacity-40',
 rankingEven: 'bg-green-700 bg-opacity-50'
} as const;

// Halloween Theme Classes
const HALLOWEEN_CLASSES = {
 container: 'bg-gradient-to-br from-purple-900 via-orange-900 to-black',
 textPrimary: 'text-orange-100',
 textSecondary: 'text-orange-200',
 textAccent: 'text-yellow-300',
 rankingFirst: 'bg-gradient-to-r from-yellow-400 via-yellow-500 to-amber-500',
 rankingSecond: 'bg-gradient-to-r from-gray-300 via-gray-400 to-gray-500',
 rankingThird: 'bg-gradient-to-r from-amber-600 via-amber-700 to-orange-600',
 rankingOdd: 'bg-purple-800 bg-opacity-40',
 rankingEven: 'bg-orange-800 bg-opacity-50'
} as const;

// Crimson Fury Theme Classes
const CRIMSON_FURY_CLASSES = {
 container: 'bg-gradient-to-br from-red-900 via-red-800 to-black',
 textPrimary: 'text-red-100',
 textSecondary: 'text-red-200',
 textAccent: 'text-pink-300',
 rankingFirst: 'bg-gradient-to-r from-yellow-400 via-yellow-500 to-amber-500',
 rankingSecond: 'bg-gradient-to-r from-gray-300 via-gray-400 to-gray-500',
 rankingThird: 'bg-gradient-to-r from-amber-600 via-amber-700 to-orange-600',
 rankingOdd: 'bg-red-800 bg-opacity-40',
 rankingEven: 'bg-red-700 bg-opacity-50'
} as const;

// 静的テーママップ
const STATIC_THEME_MAP = {
 ocean: OCEAN_CLASSES,
 caveMining: CAVE_MINING_CLASSES,
 GouseiSuika: GOUSEI_SUIKA_CLASSES,
 halloween: HALLOWEEN_CLASSES,
 crimsonFury: CRIMSON_FURY_CLASSES
} as const;
</script>
