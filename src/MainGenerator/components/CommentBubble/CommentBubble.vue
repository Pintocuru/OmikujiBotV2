<!-- C:\_root\_nodejs\OmikenTemplates\templates\OmikujiBot\src\MainGenerator\components\OmikujiBot\OmikujiBot.vue -->
<template>
  <div v-if="displayStore.currentScriptKey === null">
    <!-- BOTメッセージ表示 -->
    <ViewBotMessage v-if="!showCharacterPersistent" />

    <!-- 常時表示キャラクター -->
    <ViewBotCharacter v-else />
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import ViewBotMessage from './ViewBotMessage.vue'
  import ViewBotCharacter from './ViewBotCharacter.vue'
  import { useAppStore, useDisplayStore } from '@/MainGenerator/stores/'

  // Piniaストアの使用
  const appStore = useAppStore()
  const displayStore = useDisplayStore()

  // キャラクター常時表示設定
  const showCharacterPersistent = computed(() => {
    return appStore.data?.displaySettings?.base?.showCharacterPersistent
  })
</script>
