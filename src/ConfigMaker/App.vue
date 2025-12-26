<!-- src/configMaker/App.vue -->
<template>
  <div class="p-4 max-w-6xl min-w-xl pb-64 overflow-x-hidden mx-auto" :data-theme="data.settings.daisyUiTheme">
    <!-- タイトル -->
    <AppHeader />

    <!-- 開発者用プリセット管理 -->
    <component :is="devToolsComponent" v-if="devToolsComponent" />

    <!-- 設定読み込み・書き出し -->
    <div class="flex justify-between">
      <ConfigImport />
      <ConfigExport />

      <!-- インポートプレビューモーダル -->
      <ConfigImportModal v-if="importStore.showPreviewModal" />
    </div>

    <!-- 開発版の起動時に「開発者用プリセット管理」を目立たせるためのダミー -->
    <div v-if="isDev && Object.keys(data.comments).length === 0" class="hero bg-base-200 min-h-screen">
      <div class="hero-content text-center">
        <div class="max-w-md">
          <h1 class="text-5xl font-bold">Welcome to <br />"Dev World..."</h1>
          <p class="py-6">
            おまえが長く深淵を覗くならば、<br />
            深淵もまた等しくおまえを見返すのだ。<br />
            …で、どうやって君はこのコメントを見つけたんだ？
          </p>
          <button class="btn btn-primary" @click="openLocalOmikujiData">omikujiData.js を開く</button>
        </div>
      </div>
    </div>

    <!-- ナビゲーションタブ -->
    <NavigationTabs />

    <!-- コンテンツ -->
    <ContentArea />

    <!-- Dock/ナビゲーションボタン/トースト -->
    <FloatingElements />
  </div>
</template>

<script setup lang="ts">
  import { markRaw, ref } from 'vue'
  import { isDev } from '@/types/'
  import AppHeader from './components/appItems/AppHeader.vue'
  import { useScrollBehavior } from './components/appItems/useScrollBehavior'
  import NavigationTabs from './components/appItems/NavigationTabs.vue'
  import ContentArea from './components/appItems/ContentArea.vue'
  import FloatingElements from './components/appItems/FloatingElements.vue'
  import ConfigImport from '@ConfigComponents/presetsImport/ConfigImport.vue'
  import ConfigExport from '@ConfigComponents/presetsExport/ConfigExport.vue'
  import { useImportStore } from '@/ConfigMaker/components/presetsImport/useImportStore'
  import { useOmikujiStore } from '@ConfigStores/useOmikujiStore'
  import ConfigImportModal from '@/ConfigMaker/components/presetsImport/ConfigImportModal.vue'
  import { storeToRefs } from 'pinia'

  const omikujiStore = useOmikujiStore()
  const importStore = useImportStore()
  const { data } = storeToRefs(omikujiStore)

  // 開発者ツール
  const devToolsComponent = ref<any | null>(null)
  if (isDev) {
    import('@/ConfigMaker/dev/DevConfigs.vue').then((mod) => {
      devToolsComponent.value = markRaw(mod.default)
    })
  }

  // assets の omikujiData.js を開く
  const openLocalOmikujiData = () => {
    omikujiStore.loadData(window.omikujiData)
  }

  // スクロール動作
  useScrollBehavior()
</script>
