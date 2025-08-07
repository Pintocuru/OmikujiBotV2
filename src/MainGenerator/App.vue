<!-- src/MainGenerator/App.vue -->
<template>
 <div v-if="appStore.isInitialized">
  <!-- BOTメッセージ表示 -->
  <ViewBotMessage v-if="displayStore.currentScriptKey === null" />

  <!-- Scriptsゲーム表示 -->
  <GameRankingViewer
   v-else-if="displayStore.currentScriptKey !== null"
   :key="displayStore.currentComponentKey"
  />

  <!-- コントロールパネル（中央ホバーで表示:GODモードでのみ表示） -->
  <DisplayControlPanel v-if="developer.godModeEnabled" />

  <!-- トースト表示 -->
  <ViewBotToast v-if="base.toastEnabled" />

  <!-- キャラクターサムネイル -->
  <CharacterThumbnails v-if="base.modeSwitchEnabled" />
 </div>
 <!-- わんコメが起動されていない場合のエラー表示 -->
 <ErrorInitComponent v-else :pluginUid="null" />
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import ViewBotMessage from '@MainComponents/OmikujiBot/ViewBotMessage.vue';
import ViewBotToast from '@/MainGenerator/components/OmikujiBot/ViewBotToast.vue';
import CharacterThumbnails from '@MainComponents/OmikujiBot/CharacterThumbnails.vue';
import DisplayControlPanel from '@MainComponents/OmikujiBot/DisplayControlPanel.vue';
import ErrorInitComponent from '@shared/components/error/ErrorInitComponent.vue';
import GameRankingViewer from '@MainComponents/GameRankingViewer/GameRankingViewer.vue';
import { useAppStore, useDisplayStore } from '@/MainGenerator/stores/';

// Piniaストアの使用
const appStore = useAppStore();
const displayStore = useDisplayStore();
const { base, developer } = appStore.omikujiData.displaySettings;

// 初期化処理
onMounted(async () => {
 await appStore.initializeApp(); // アプリケーションの初期化
 displayStore.initializeDisplayMode(); // 表示モードの初期化
});
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Zen+Maru+Gothic:wght@700;900&display=swap');
html,
body {
 height: 100%;
 width: 100%;
 margin: 0;
 padding: 0;
 overflow: hidden;
 font-family: 'Zen Maru Gothic', sans-serif;
}
</style>
