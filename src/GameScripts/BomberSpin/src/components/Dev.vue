<!-- src/components/Dev.vue -->
<template>
 <div class="p-8 bg-gray-100 min-h-screen">
  <h1 class="text-3xl font-bold mb-6">コンポーネント開発</h1>

  <!-- 各種サイズでの表示テスト -->
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
   <!-- Extra Small サイズ -->
   <div class="bg-white p-6 rounded-lg shadow">
    <h2 class="text-xl font-semibold mb-4">Extra Small Size (xs)</h2>
    <SuikaComponent :settings="mockSettings" :userRankings="mockUserRanking" displaySize="xs" />
   </div>

   <!-- Small サイズ -->
   <div class="bg-white p-6 rounded-lg shadow">
    <h2 class="text-xl font-semibold mb-4">Small Size (sm)</h2>
    <SuikaComponent :settings="mockSettings" :userRankings="mockUserRanking" displaySize="sm" />
   </div>

   <!-- Medium サイズ -->
   <div class="bg-white p-6 rounded-lg shadow">
    <h2 class="text-xl font-semibold mb-4">Medium Size (md)</h2>
    <SuikaComponent :settings="mockSettings" :userRankings="mockUserRanking" displaySize="md" />
   </div>

   <!-- Large サイズ -->
   <div class="bg-white p-6 rounded-lg shadow">
    <h2 class="text-xl font-semibold mb-4">Large Size (lg)</h2>
    <SuikaComponent :settings="mockSettings" :userRankings="mockUserRanking" displaySize="lg" />
   </div>

   <!-- Extra Large サイズ -->
   <div class="bg-white p-6 rounded-lg shadow">
    <h2 class="text-xl font-semibold mb-4">Extra Large Size (xl)</h2>
    <SuikaComponent :settings="mockSettings" :userRankings="mockUserRanking" displaySize="xl" />
   </div>
  </div>

  <!-- データ操作パネル -->
  <div class="mt-8 bg-white p-6 rounded-lg shadow">
   <h2 class="text-xl font-semibold mb-4">データ操作</h2>
   <div class="flex gap-4 mb-4">
    <button
     @click="addRandomPlayer"
     class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
    >
     ランダムプレイヤー追加
    </button>
    <button @click="resetData" class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
     データリセット
    </button>
    <button
     @click="sortByScore"
     class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
    >
     スコア順ソート
    </button>
   </div>

   <!-- 現在のデータ表示 -->
   <div class="bg-gray-50 p-4 rounded">
    <h3 class="font-semibold mb-2">現在のデータ:</h3>
    <pre class="text-sm">{{ JSON.stringify(mockUserRanking, null, 2) }}</pre>
   </div>
  </div>
 </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import SuikaComponent from '@/components/component.vue';
import { GameSettings } from '@/params';
import { UserStatsType } from '@type/index';
import { generateMockUserRankingData } from '__mocks__/mockUserRanking';

// モックデータ
const mockUserRanking = ref<UserStatsType[]>(generateMockUserRankingData());

const mockSettings: GameSettings = {
 isParty: true,
 rankingLimit: 10,
 enableCount: 5
};

// データ操作関数
const addRandomPlayer = () => {
 const names = ['新プレイヤー', 'テスト', 'サンプル', 'ダミー'];
 const randomName = names[Math.floor(Math.random() * names.length)];
 const randomPoints = Math.floor(Math.random() * 1500) + 100;

 mockUserRanking.value.unshift({
  name: `${randomName}${mockUserRanking.value.length + 1}`,
  points: randomPoints,
  userId: '',
  draws: 0,
  wins: 0,
  totalPoints: 0,
  rank: 5,
  rate: 0
 });
};

const resetData = () => {
 mockUserRanking.value = [
  {
   name: '太郎',
   userId: 'user001',
   points: 1250,
   draws: 1,
   wins: 10,
   totalPoints: 1500,
   rank: 1,
   rate: 85
  },
  {
   name: 'さくら',
   userId: 'user002',
   points: 980,
   draws: 2,
   wins: 8,
   totalPoints: 1200,
   rank: 4,
   rate: 78
  },
  {
   name: 'ゆき',
   userId: 'user003',
   points: 1100,
   draws: 0,
   wins: 9,
   totalPoints: 1350,
   rank: 2,
   rate: 80
  }
 ];
};

const sortByScore = () => {
 mockUserRanking.value.sort((a, b) => b.points ?? 0 - (a?.points ?? 0));
};
</script>
