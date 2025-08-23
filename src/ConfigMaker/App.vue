<!-- src/configMaker/App.vue -->
<template>
  <div class="p-4 max-w-6xl min-w-xl pb-64 overflow-x-hidden mx-auto">
    <!-- タイトル -->
    <AppHeader />

    <!-- 開発者用プリセット管理 -->
    <component :is="devToolsComponent" v-if="devToolsComponent" />

    <!-- 設定読み込み・書き出し -->
    <div class="flex justify-between">
      <ConfigImport />
      <ConfigExport />
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
          <button class="btn btn-primary">押したって何もねえよ</button>
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
  import { markRaw, ref, watch } from 'vue'
  import { isDev } from '@/types/'
  import { useScrollBehavior } from './components/appItems/useScrollBehavior'
  import ConfigImport from '@ConfigComponents/presets/ConfigImport.vue'
  import ConfigExport from '@ConfigComponents/presets/ConfigExport.vue'
  import NavigationTabs from './components/appItems/NavigationTabs.vue'
  import ContentArea from './components/appItems/ContentArea.vue'
  import FloatingElements from './components/appItems/FloatingElements.vue'
  import AppHeader from './components/appItems/AppHeader.vue'
  import { storeToRefs } from 'pinia'
  import { useOmikujiStore } from '@ConfigStores/useOmikujiStore'

  const omikujiStore = useOmikujiStore()
  const { data } = storeToRefs(omikujiStore)

  // 開発者ツール
  const devToolsComponent = ref<any | null>(null)
  if (isDev) {
    import('@/ConfigMaker/dev/DevConfigs.vue').then((mod) => {
      devToolsComponent.value = markRaw(mod.default)
    })
  }

  // テーマを <html data-theme=""> に反映（DaisyUI 用）
  watch(
    () => data.value.displaySettings.base.daisyUiTheme,
    async (newTheme) => {
      if (newTheme) {
        document.documentElement.setAttribute('data-theme', newTheme)
      }
    },
    { immediate: true }
  )

  // スクロール動作
  useScrollBehavior()
</script>
