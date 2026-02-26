<!-- src/ConfigMaker/App.vue -->
<template>
  <div class="p-4 max-w-6xl pb-32 overflow-x-hidden mx-auto space-y-4" :data-theme="daisyUiTheme">
    <!-- タイトル -->
    <AppHeader />

    <!-- プリセット管理 -->
    <PresetTool v-if="isServerConnected" />

    <!-- 設定読み込み・書き出し -->
    <div class="flex justify-between">
      <ConfigImport />
      <ConfigExport />

      <!-- インポートプレビューモーダル -->
      <ConfigImportModal v-if="importManager.showPreviewModal.value" :import-manager="importManager" />
    </div>

    <!-- 開発版の起動時に「開発者用プリセット管理」を目立たせるためのダミー -->
    <div
      v-if="isDev && Object.keys(data.comments).length === 0 && daisyUiTheme === 'dark'"
      class="hero bg-base-200 min-h-screen"
    >
      <div class="hero-content text-center">
        <div class="max-w-md space-y-4">
          <h1 class="text-5xl font-bold">Welcome to <br />"Dev World..."</h1>
          <p>
            おまえが長く深淵を覗くならば、<br />
            深淵もまた等しくおまえを見返すのだ。<br />
            …で、どうやって君はこのコメントを見つけたんだ？
          </p>
          <button class="btn btn-primary" @click="omikujiStore.openLocalOmikujiData()">omikujiData.js を開く</button>
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
  import { onMounted, computed } from 'vue'
  import { storeToRefs } from 'pinia'
  import { isDev } from '@/types/'
  import AppHeader from './components/appItems/AppHeader.vue'
  import { useScrollBehavior } from './components/appItems/useScrollBehavior'
  import NavigationTabs from './components/appItems/NavigationTabs.vue'
  import ContentArea from './components/appItems/ContentArea.vue'
  import FloatingElements from './components/appItems/FloatingElements.vue'
  import ConfigImport from './components/presetsImport/ConfigImport.vue'
  import ConfigExport from './components/presetsExport/ConfigExport.vue'
  import ConfigImportModal from './components/presetsImport/ConfigImportModal.vue'
  import { useImportManager } from './components/presetsImport/composables/useImportManager'
  import { useOmikujiStore } from './stores/useOmikujiStore'
  import PresetTool from '@/PresetManager//DevConfigs.vue'
  import { useDevStore } from '../PresetManager/stores/useDevStore'
  import { generatorApi } from '../PresetManager/services/generatorApi'

  // stores
  const omikujiStore = useOmikujiStore()
  const devStore = useDevStore()
  const { data } = storeToRefs(omikujiStore)
  const { isServerConnected } = storeToRefs(devStore)

  // インポートマネージャー
  const importManager = useImportManager()

  const daisyUiTheme = computed(() => data.value.settings.daisyUiTheme)

  // スクロール動作
  useScrollBehavior()

  onMounted(async () => {
    let isHealth = false

    try {
      isHealth = await generatorApi.getHealth()
    } catch (e) {
      console.warn('Health check failed:', e)
    }

    if (isHealth) {
      isServerConnected.value = true
      if (isDev) return // devならデータを読まない
      try {
        const lowData = await generatorApi.loadGeneratorConfig()
        if (lowData) {
          omikujiStore.loadData(lowData)
          return
        }
      } catch (e) {
        console.warn('loadGeneratorConfig failed:', e)
      }
    }

    // ローカルを読む
    omikujiStore.openLocalOmikujiData()
  })
</script>
