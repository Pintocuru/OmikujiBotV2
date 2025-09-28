<!-- templates\OmikujiBot\src\MainGenerator\components\OmikujiBot\OmikujiBot.vue -->
<template>
  <!-- BOTメッセージ表示 -->
  <ViewBotMessage v-if="!showCharacterPersistent" />

  <!-- 常時表示キャラクター -->
  <ViewBotCharacter v-else />
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import ViewBotMessage from './ViewBotMessage.vue'
  import ViewBotCharacter from './ViewBotCharacter.vue'
  import { useAppStore } from '@/MainGenerator/stores/useAppStore'

  // Piniaストアの使用
  const appStore = useAppStore()

  // キャラクター常時表示設定
  const showCharacterPersistent = computed(() => {
    return appStore.data?.displaySettings?.base?.showCharacterPersistent
  })
</script>
