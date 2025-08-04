<!-- src/MainGenerator/components/GameRankingViewer/Dev.vue -->
<template>
 <div class="dev-panel p-4 mt-4 bg-gray-100 border border-gray-300 rounded-lg">
  <h3 class="text-lg font-bold mb-4 text-gray-800">🛠️ Dev Controls</h3>

  <!-- User Rankings Controls -->
  <div class="mb-6">
   <h4 class="font-semibold mb-2 text-gray-700">
    User Rankings ({{ testUserRankings.length }} items)
   </h4>
   <div class="flex flex-wrap gap-2 mb-2">
    <button
     @click="addRandomUser"
     class="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
    >
     Add Random User
    </button>
    <button
     @click="addTopScoreUser"
     class="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
    >
     Add Top Score User
    </button>
    <button @click="clearUsers" class="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600">
     Clear All
    </button>
    <button
     @click="generateTestData"
     class="px-3 py-1 bg-purple-500 text-white rounded hover:bg-purple-600"
    >
     Generate 10 Users
    </button>
   </div>
  </div>

  <!-- Display Size Controls -->
  <div class="mb-6">
   <h4 class="font-semibold mb-2 text-gray-700">Display Size: {{ testDisplaySize }}</h4>
   <div class="flex flex-wrap gap-2">
    <button
     v-for="size in displaySizes"
     :key="size"
     @click="testDisplaySize = size"
     :class="[
      'px-3 py-1 rounded',
      testDisplaySize === size
       ? 'bg-blue-600 text-white'
       : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
     ]"
    >
     {{ size }}
    </button>
   </div>
  </div>

  <!-- Score Display Controls -->
  <div class="mb-6">
   <h4 class="font-semibold mb-2 text-gray-700">
    Score Display: {{ testScoreDisplay.isVisible.value ? 'Visible' : 'Hidden' }}
   </h4>
   <div class="flex flex-wrap gap-2">
    <button
     @click="testScoreDisplay.manualStart()"
     class="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
    >
     Show Score
    </button>
    <button
     @click="testScoreDisplay.manualHide()"
     class="px-3 py-1 bg-orange-500 text-white rounded hover:bg-orange-600"
    >
     Hide Score
    </button>
    <button
     @click="toggleScoreDisplay"
     class="px-3 py-1 bg-purple-500 text-white rounded hover:bg-purple-600"
    >
     Toggle
    </button>
    <button
     @click="testScoreDisplay.clearTimers()"
     class="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600"
    >
     Clear Timers
    </button>
   </div>
  </div>

  <!-- Component Config Preview -->
  <div class="mb-4">
   <h4 class="font-semibold mb-2 text-gray-700">Component Config</h4>
   <div class="flex flex-wrap gap-2 mb-2">
    <button
     @click="cycleTheme"
     class="px-3 py-1 bg-indigo-500 text-white rounded hover:bg-indigo-600"
    >
     Change Theme ({{ currentThemeIndex + 1 }}/{{ testThemes.length }})
    </button>
   </div>
   <div class="text-xs text-gray-600 bg-white p-2 rounded border max-h-32 overflow-y-auto">
    <pre>{{ JSON.stringify(testComponentConfig, null, 2) }}</pre>
   </div>
  </div>

  <!-- Test Components -->
  <div class="border-t pt-4">
   <h4 class="font-semibold mb-4 text-gray-700">Test Components</h4>

   <!-- GameRankingScore Test -->
   <div class="mb-4 p-3 bg-white rounded border">
    <h5 class="font-medium mb-2">GameRankingScore</h5>
    <GameRankingScore
     v-if="testScoreDisplay.isVisible.value && testUserRankings.length > 0"
     :player-data="testUserRankings[0]"
     :theme="testComponentConfig"
     :size-config="testSizeConfig"
     :score-display="testComponentConfig.scoreDisplay"
    />
    <div v-else class="text-gray-500 italic">
     {{ testUserRankings.length === 0 ? 'No users available' : 'Score display is hidden' }}
    </div>
   </div>

   <!-- GameRankingList Test -->
   <div class="p-3 bg-white rounded border">
    <h5 class="font-medium mb-2">GameRankingList</h5>
    <GameRankingList
     :user-rankings="testUserRankings"
     :theme="testComponentConfig"
     :size-config="testSizeConfig"
     :game-statistics="testGameStatistics"
     :format-player-info="formatPlayerInfo"
     :get-ranking-row-class="getRankingRowClass"
     :get-ranking-number-class="getRankingNumberClass"
    />
   </div>
  </div>
 </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { COMPONENT_SIZE_CONFIG } from '@/MainGenerator/components/GameRankingViewer/useComponentConfig';
import { useDelayedDisplay } from '@/MainGenerator/components/GameRankingViewer/useDelayedDisplay';
import { useGameRanking } from './useGameRanking';
import type { GameComponentConfig } from '@/types/GameComponent/GameRankingTypes';
import GameRankingScore from './GameRankingScore.vue';
import GameRankingList from './GameRankingList.vue';
import { DisplaySize } from '@shared/types';

// Display sizes
const displaySizes: DisplaySize[] = ['xs', 'sm', 'md', 'lg', 'xl'];
const testDisplaySize = ref<DisplaySize>('md');

// Test user rankings
const testUserRankings = ref<any[]>([]);

// Score display control
const testScoreDisplay = useDelayedDisplay(() => testUserRankings.value, {
 delayMs: 500,
 displayMs: 10000
});

// Toggle function for score display
const toggleScoreDisplay = () => {
 if (testScoreDisplay.isVisible.value) {
  testScoreDisplay.manualHide();
 } else {
  testScoreDisplay.manualStart();
 }
};

// Size configuration
const testSizeConfig = computed(() => COMPONENT_SIZE_CONFIG[testDisplaySize.value]);

// Test themes
const testThemes: GameComponentConfig[] = [
 // 1. 💣 Bomber Slot Theme (Original)
 {
  textColors: {
   primary: 'text-yellow-400',
   secondary: 'text-stone-100',
   accent: 'text-red-500'
  },
  backgrounds: {
   base: 'bg-gradient-to-br from-stone-900 via-gray-800 to-stone-950 border-4 border-stone-700',
   ranking: {
    first: 'bg-gradient-to-r from-amber-300 to-orange-400 text-stone-800 border-amber-300',
    second: 'bg-gradient-to-r from-gray-300 to-gray-500 text-gray-800 border-gray-400',
    third: 'bg-gradient-to-r from-orange-400 to-red-600 text-stone-800 border-orange-400',
    oddRow: 'text-amber-300 bg-red-800 bg-opacity-70 border-amber-300',
    evenRow: 'text-amber-300 bg-stone-800 bg-opacity-70 border-orange-400'
   }
  },
  fontStyles: {
   scoreText: 'font-bold text-2xl',
   rankingText: 'font-medium'
  },
  scoreDisplay: {
   scoreIcon: {
    iconName: 'Bomb',
    iconColor: 'text-red-700',
    customClass: 'bg-red-900 p-2 rounded-full'
   },
   scoreAnimation: 'bounce'
  },
  displaySettings: {
   titleText: '💣 Bomber Slot Rankings 💥',
   highlightTopThree: true,
   scoreFormat: '<<points>> [<<itemValue1>>] (<<name>>)'
  }
 },

 // 2. ⚡ Cyber Tech Theme
 {
  textColors: {
   primary: 'text-cyan-400',
   secondary: 'text-slate-300',
   accent: 'text-violet-400'
  },
  backgrounds: {
   base: 'bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-950 border-2 border-cyan-500',
   ranking: {
    first:
     'bg-gradient-to-r from-cyan-400 to-blue-500 text-gray-900 border-cyan-300 shadow-lg shadow-cyan-500/50',
    second:
     'bg-gradient-to-r from-violet-400 to-purple-500 text-white border-violet-300 shadow-lg shadow-violet-500/50',
    third:
     'bg-gradient-to-r from-blue-400 to-indigo-500 text-white border-blue-300 shadow-lg shadow-blue-500/50',
    oddRow: 'text-cyan-300 bg-slate-800 bg-opacity-80 border-cyan-500/30',
    evenRow: 'text-violet-300 bg-indigo-900 bg-opacity-80 border-violet-500/30'
   }
  },
  fontStyles: {
   scoreText: 'font-mono font-bold text-3xl',
   rankingText: 'font-mono font-semibold'
  },
  scoreDisplay: {
   scoreIcon: {
    iconName: 'Zap',
    iconColor: 'text-cyan-400',
    customClass: 'bg-cyan-900 p-2 rounded-lg border border-cyan-500'
   },
   scoreAnimation: 'zoomIn'
  },
  displaySettings: {
   titleText: '⚡ CYBER LEADERBOARD ⚡',
   highlightTopThree: true,
   scoreFormat: '<<totalPoints>> XP | Lvl.<<itemValue2>>'
  }
 },

 // 3. 🌸 Sakura Fantasy Theme
 {
  textColors: {
   primary: 'text-pink-600',
   secondary: 'text-rose-800',
   accent: 'text-purple-600'
  },
  backgrounds: {
   base: 'bg-gradient-to-br from-pink-50 via-rose-100 to-purple-100 border-4 border-rose-300',
   ranking: {
    first: 'bg-gradient-to-r from-pink-200 to-rose-300 text-rose-900 border-pink-400 shadow-md',
    second: 'bg-gradient-to-r from-rose-200 to-pink-300 text-pink-900 border-rose-400 shadow-md',
    third:
     'bg-gradient-to-r from-purple-200 to-violet-300 text-purple-900 border-purple-400 shadow-md',
    oddRow: 'text-rose-700 bg-pink-100 bg-opacity-90 border-pink-300',
    evenRow: 'text-pink-700 bg-rose-50 bg-opacity-90 border-rose-300'
   }
  },
  fontStyles: {
   scoreText: 'font-serif font-bold text-2xl',
   rankingText: 'font-serif font-medium'
  },
  scoreDisplay: {
   scoreIcon: {
    iconName: 'Heart',
    iconColor: 'text-pink-500',
    customClass: 'bg-pink-100 p-2 rounded-full border border-pink-300'
   },
   scoreAnimation: 'heartBeat'
  },
  displaySettings: {
   titleText: '🌸 Cherry Blossom Rankings 🌸',
   highlightTopThree: true,
   scoreFormat: '<<points>>pts ♡ <<name>>'
  }
 },

 // 4. 🔥 Fire Dragon Theme
 {
  textColors: {
   primary: 'text-orange-300',
   secondary: 'text-red-200',
   accent: 'text-yellow-400'
  },
  backgrounds: {
   base: 'bg-gradient-to-br from-red-900 via-orange-800 to-yellow-800 border-4 border-orange-600',
   ranking: {
    first:
     'bg-gradient-to-r from-yellow-400 to-orange-500 text-red-900 border-yellow-500 shadow-lg shadow-orange-500/50',
    second:
     'bg-gradient-to-r from-orange-400 to-red-500 text-white border-orange-500 shadow-lg shadow-red-500/50',
    third:
     'bg-gradient-to-r from-red-500 to-pink-600 text-white border-red-500 shadow-lg shadow-pink-500/50',
    oddRow: 'text-orange-200 bg-red-800 bg-opacity-80 border-orange-500/40',
    evenRow: 'text-yellow-200 bg-orange-900 bg-opacity-80 border-red-500/40'
   }
  },
  fontStyles: {
   scoreText: 'font-bold text-3xl',
   rankingText: 'font-semibold'
  },
  scoreDisplay: {
   scoreIcon: {
    iconName: 'Flame',
    iconColor: 'text-orange-400',
    customClass: 'bg-red-900 p-2 rounded-lg border border-orange-500'
   },
   scoreAnimation: 'pulse'
  },
  displaySettings: {
   titleText: '🔥 Dragon Tournament 🐉',
   highlightTopThree: true,
   scoreFormat: '<<points>> DMG | <<wins>> Victories'
  }
 },

 // 5. 🌊 Ocean Depths Theme
 {
  textColors: {
   primary: 'text-blue-300',
   secondary: 'text-teal-200',
   accent: 'text-cyan-400'
  },
  backgrounds: {
   base: 'bg-gradient-to-br from-blue-900 via-teal-800 to-cyan-900 border-4 border-teal-600',
   ranking: {
    first:
     'bg-gradient-to-r from-cyan-300 to-blue-400 text-blue-900 border-cyan-400 shadow-lg shadow-cyan-400/50',
    second:
     'bg-gradient-to-r from-teal-300 to-cyan-400 text-teal-900 border-teal-400 shadow-lg shadow-teal-400/50',
    third:
     'bg-gradient-to-r from-blue-300 to-teal-400 text-blue-900 border-blue-400 shadow-lg shadow-blue-400/50',
    oddRow: 'text-cyan-200 bg-blue-800 bg-opacity-70 border-cyan-500/30',
    evenRow: 'text-teal-200 bg-teal-900 bg-opacity-70 border-teal-500/30'
   }
  },
  fontStyles: {
   scoreText: 'font-sans font-bold text-2xl',
   rankingText: 'font-sans font-medium'
  },
  scoreDisplay: {
   scoreIcon: {
    iconName: 'Waves',
    iconColor: 'text-cyan-400',
    customClass: 'bg-blue-900 p-2 rounded-full border border-cyan-500'
   },
   scoreAnimation: 'slideInDown'
  },
  displaySettings: {
   titleText: '🌊 Deep Sea Leaderboard 🐟',
   highlightTopThree: true,
   scoreFormat: '<<totalPoints>> Pearls | Depth: <<itemValue3>>'
  }
 },

 // 6. 🌌 Space Galaxy Theme
 {
  textColors: {
   primary: 'text-purple-300',
   secondary: 'text-indigo-200',
   accent: 'text-pink-400'
  },
  backgrounds: {
   base: 'bg-gradient-to-br from-indigo-950 via-purple-900 to-black border-4 border-purple-600',
   ranking: {
    first:
     'bg-gradient-to-r from-purple-400 to-pink-500 text-white border-purple-500 shadow-lg shadow-purple-500/50',
    second:
     'bg-gradient-to-r from-indigo-400 to-purple-500 text-white border-indigo-500 shadow-lg shadow-indigo-500/50',
    third:
     'bg-gradient-to-r from-pink-400 to-purple-500 text-white border-pink-500 shadow-lg shadow-pink-500/50',
    oddRow: 'text-purple-200 bg-indigo-900 bg-opacity-60 border-purple-500/30',
    evenRow: 'text-pink-200 bg-purple-900 bg-opacity-60 border-pink-500/30'
   }
  },
  fontStyles: {
   scoreText: 'font-mono font-bold text-2xl',
   rankingText: 'font-mono font-medium'
  },
  scoreDisplay: {
   scoreIcon: {
    iconName: 'Rocket',
    iconColor: 'text-purple-400',
    customClass: 'bg-indigo-900 p-2 rounded-lg border border-purple-500'
   },
   scoreAnimation: 'rotateIn'
  },
  displaySettings: {
   titleText: '🌌 Galactic Commanders 🚀',
   highlightTopThree: true,
   scoreFormat: '<<points>> Credits | Rank: <<itemValue2>>'
  }
 },

 // 7. 🍃 Forest Nature Theme
 {
  textColors: {
   primary: 'text-green-600',
   secondary: 'text-emerald-700',
   accent: 'text-lime-600'
  },
  backgrounds: {
   base: 'bg-gradient-to-br from-green-100 via-emerald-50 to-lime-100 border-4 border-green-400',
   ranking: {
    first:
     'bg-gradient-to-r from-green-300 to-emerald-400 text-green-900 border-green-500 shadow-md',
    second:
     'bg-gradient-to-r from-emerald-300 to-teal-400 text-emerald-900 border-emerald-500 shadow-md',
    third: 'bg-gradient-to-r from-lime-300 to-green-400 text-lime-900 border-lime-500 shadow-md',
    oddRow: 'text-green-700 bg-green-50 bg-opacity-80 border-green-300',
    evenRow: 'text-emerald-700 bg-emerald-50 bg-opacity-80 border-emerald-300'
   }
  },
  fontStyles: {
   scoreText: 'font-serif font-bold text-2xl',
   rankingText: 'font-serif font-medium'
  },
  scoreDisplay: {
   scoreIcon: {
    iconName: 'Leaf',
    iconColor: 'text-green-600',
    customClass: 'bg-green-100 p-2 rounded-full border border-green-400'
   },
   scoreAnimation: 'fadeInUp'
  },
  displaySettings: {
   titleText: '🍃 Forest Champions 🌲',
   highlightTopThree: true,
   scoreFormat: '<<points>> Seeds | Level <<itemValue2>>'
  }
 },

 // 8. ⚔️ Medieval Knight Theme
 {
  textColors: {
   primary: 'text-amber-600',
   secondary: 'text-yellow-700',
   accent: 'text-orange-600'
  },
  backgrounds: {
   base: 'bg-gradient-to-br from-amber-50 via-yellow-100 to-orange-100 border-4 border-amber-600',
   ranking: {
    first:
     'bg-gradient-to-r from-yellow-300 to-amber-400 text-amber-900 border-yellow-500 shadow-lg shadow-amber-500/50',
    second:
     'bg-gradient-to-r from-gray-300 to-slate-400 text-gray-900 border-gray-500 shadow-lg shadow-gray-500/50',
    third:
     'bg-gradient-to-r from-orange-300 to-amber-400 text-orange-900 border-orange-500 shadow-lg shadow-orange-500/50',
    oddRow: 'text-amber-800 bg-amber-100 bg-opacity-70 border-amber-400',
    evenRow: 'text-yellow-800 bg-yellow-50 bg-opacity-70 border-yellow-400'
   }
  },
  fontStyles: {
   scoreText: 'font-serif font-bold text-3xl',
   rankingText: 'font-serif font-semibold'
  },
  scoreDisplay: {
   scoreIcon: {
    iconName: 'Sword',
    iconColor: 'text-amber-600',
    customClass: 'bg-amber-100 p-2 rounded-lg border border-amber-500'
   },
   scoreAnimation: 'flipInY'
  },
  displaySettings: {
   titleText: '⚔️ Knights of Honor 🛡️',
   highlightTopThree: true,
   scoreFormat: 'Sir <<name>> | <<points>> Glory'
  }
 }
];

const currentThemeIndex = ref(0);
const testComponentConfig = computed(() => testThemes[currentThemeIndex.value]);

// Theme cycling
const cycleTheme = () => {
 currentThemeIndex.value = (currentThemeIndex.value + 1) % testThemes.length;
};

// Game statistics (mock)
const testGameStatistics = computed(() => ({
 totalPlayers: testUserRankings.value.length,
 averageScore:
  testUserRankings.value.length > 0
   ? testUserRankings.value.reduce((sum, user) => sum + (user.points || 0), 0) /
     testUserRankings.value.length
   : 0
}));

// User management functions
const generateRandomUser = (index: number) => ({
 userId: `user_${Date.now()}_${index}`,
 name: `Player ${index + 1}`,
 draws: Math.floor(Math.random() * 100) + 1,
 wins: Math.floor(Math.random() * 50),
 points: Math.floor(Math.random() * 1000) + 100,
 totalPoints: Math.floor(Math.random() * 5000) + 500,
 rank: index + 1,
 rate: Math.random() * 0.8 + 0.2,
 itemValue1: `${Math.floor(Math.random() * 100)}`,
 itemValue2: `Level ${Math.floor(Math.random() * 10) + 1}`,
 itemValue3: `${Math.floor(Math.random() * 1000)}hp`,
 priority: Math.floor(Math.random() * 10)
});

const addRandomUser = () => {
 const newUser = generateRandomUser(testUserRankings.value.length);
 testUserRankings.value.push(newUser);
 // Re-rank users by points
 testUserRankings.value.sort((a, b) => b.points - a.points);
 testUserRankings.value.forEach((user, index) => {
  user.rank = index + 1;
 });
};

const addTopScoreUser = () => {
 const maxPoints =
  testUserRankings.value.length > 0
   ? Math.max(...testUserRankings.value.map((u) => u.points)) + 100
   : 1000;
 const newUser = {
  ...generateRandomUser(0),
  name: 'Top Player',
  points: maxPoints,
  wins: 100,
  rate: 0.95
 };
 testUserRankings.value.unshift(newUser);
 // Re-rank
 testUserRankings.value.sort((a, b) => b.points - a.points);
 testUserRankings.value.forEach((user, index) => {
  user.rank = index + 1;
 });
};

const clearUsers = () => {
 testUserRankings.value = [];
};

const generateTestData = () => {
 testUserRankings.value = Array.from({ length: 10 }, (_, i) => generateRandomUser(i));
 testUserRankings.value.sort((a, b) => b.points - a.points);
 testUserRankings.value.forEach((user, index) => {
  user.rank = index + 1;
 });
};

// Game ranking composable functions (mock implementations)
const {
 gameStatistics,
 userRankings,
 formatPlayerInfo,
 getRankingRowClass,
 getRankingNumberClass
} = useGameRanking(testUserRankings.value, testComponentConfig.value);

// Initialize with some test data
generateTestData();
</script>

<style scoped>
.dev-panel {
 font-family:
  system-ui,
  -apple-system,
  sans-serif;
}

pre {
 font-size: 10px;
 line-height: 1.2;
}
</style>
