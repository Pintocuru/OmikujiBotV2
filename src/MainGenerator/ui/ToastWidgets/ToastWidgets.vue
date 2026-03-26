<!-- src/MainGenerator/ui/ToastWidgets/ToastWidgets.vue -->
<template>
  <div class="fixed bottom-4 flex flex-col z-10" :class="!toastSettings.showToastsOnRight ? 'left-4' : 'right-4'">
    <!-- トースト表示 -->
    <ViewBotToast />

    <!-- キャラクターサムネイル -->
    <CharacterThumbnails />
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { ToastWidgetsSchema } from '@/types'
  import ViewBotToast from './ViewBotToast.vue'
  import CharacterThumbnails from './CharacterThumbnails.vue'
  import { useAppStore } from '@main/stores/useAppStore'

  const appStore = useAppStore()
  const toastSettings = computed(() => appStore.data.components.settings.toast ?? ToastWidgetsSchema.parse({}))
</script>
