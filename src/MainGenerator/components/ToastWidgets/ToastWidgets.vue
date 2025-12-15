<!-- templates\OmikujiBot\src\MainGenerator\components\ToastWidgets\ToastWidgets.vue -->
<template>
  <div class="fixed bottom-4 z-20 flex flex-col" :class="!toast.showToastsOnRight ? 'left-4' : 'right-4'">
    <!-- トースト表示 -->
    <div :class="!toast.showToastsOnRight ? 'self-start' : 'self-end'">
      <ViewBotToast />
    </div>

    <!-- キャラクターサムネイル -->
    <div v-if="toast.showThumbnail" :class="!toast.showToastsOnRight ? 'self-start' : 'self-end'">
      <CharacterThumbnails />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import ViewBotToast from './ViewBotToast.vue'
  import CharacterThumbnails from './CharacterThumbnails.vue'
  import { useAppStore } from '@/MainGenerator/stores/useAppStore'

  const appStore = useAppStore()
  const toast = computed(() => appStore.data.displaySettings.components.toast)
</script>
