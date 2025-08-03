<!-- src/configMaker/App.vue -->
<template>
 <div class="p-4 max-w-6xl mx-auto pb-24">
  <AppHeader />
  <component :is="devToolsComponent" v-if="devToolsComponent" />
  <ConfigActions />
  <NavigationTabs />
  <ContentArea />
  <FloatingElements />
 </div>
</template>

<script setup lang="ts">
import { markRaw, ref } from 'vue';
import { isDev } from '@/types/';
import { useOmikujiStore } from '@ConfigStore/useOmikujiStore';
import { useScrollBehavior } from './components/appItems/useScrollBehavior';
import AppHeader from './components/appItems/AppHeader.vue';
import ConfigActions from './components/appItems/ConfigActions.vue';
import NavigationTabs from './components/appItems/NavigationTabs.vue';
import ContentArea from './components/appItems/ContentArea.vue';
import FloatingElements from './components/appItems/FloatingElements.vue';

// Store初期化
const omikujiStore = useOmikujiStore();

// 開発者ツール
const devToolsComponent = ref<any | null>(null);
if (isDev) {
 import('@/ConfigMaker/dev/DevConfigs.vue').then((mod) => {
  devToolsComponent.value = markRaw(mod.default);
 });
}

// スクロール動作
useScrollBehavior();
</script>
