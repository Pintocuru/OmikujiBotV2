<!-- src/DevApp.vue -->
<template>
  <!-- エディター -->
  <ConfigMaker v-if="!showMain" />

  <!-- ジェネレーター＋ツール -->
  <template v-else>
    <HudPreview :isHeight="false">
      <MainGenerator />
      <template #hud>
        <!-- エアコメメーカー -->
        <AirComment />
        <!-- メタデータ操作ツール -->
        <DevMetaController />
        <!-- リセットボタン -->
        <button class="btn btn-sm btn-warning" @click="resetAll">セッションリセット</button>
      </template>

      <template #hudLeft>
        <!-- 変数プレースホルダー -->
        <div
          v-for="([key, value], i) in Object.entries(appStore.placeholderVariable.getAll())"
          :key="i"
          class="flex gap-2"
        >
          <span class="font-mono w-50">{{ key }}</span>
          <span>{{ value }}</span>
        </div>
      </template>
    </HudPreview>
  </template>

  <!-- 表示トグルボタン -->
  <div class="fixed top-10 right-0 w-24 h-24 z-9999 group pointer-events-none">
    <label
      class="swap swap-rotate absolute top-4 right-4 opacity-0 group-hover:opacity-100 pointer-events-auto transition-opacity duration-200"
    >
      <input type="checkbox" v-model="showMain" />
      <Settings class="swap-on w-8 h-8 text-primary" />
      <Cpu class="swap-off w-8 h-8 text-primary" />
    </label>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import MainGenerator from './MainGenerator/App.vue'
  import ConfigMaker from './ConfigMaker/App.vue'
  import HudPreview from '@config/components/common/HudPreview/HudPreview.vue'
  import AirComment from '@/common/AirComment/AirComment.vue'
  import DevMetaController from '@/common/DevMetaController/DevMetaController.vue'
  import { Settings, Cpu } from 'lucide-vue-next'
  import { useAppStore } from './MainGenerator/stores/useAppStore'

  const showMain = ref(false)
  const appStore = useAppStore()

  // リセットボタン
  function resetAll() {
    appStore.userSession.stats.reset()
    appStore.userSession.visits.resetAll()
    appStore.streamStats.reset()
  }
</script>
