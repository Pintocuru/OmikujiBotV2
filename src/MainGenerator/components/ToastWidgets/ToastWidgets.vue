<!-- C:\_root\_nodejs\OmikenTemplates\templates\OmikujiBot\src\MainGenerator\components\ToastWidgets\ToastWidgets.vue -->
<template>
  <div class="fixed bottom-4 z-20 flex flex-col" :class="!base.showToastsOnRight ? 'left-4' : 'right-4'">
    <!-- トースト表示 -->
    <div v-if="base.showToasts" :class="!base.showToastsOnRight ? 'self-start' : 'self-end'">
      <ViewBotToast />
    </div>

    <!-- キャラクターサムネイル -->
    <div v-if="base.showCharacterThumbnail" :class="!base.showToastsOnRight ? 'self-start' : 'self-end'">
      <CharacterThumbnails />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import ViewBotToast from './ViewBotToast.vue'
  import CharacterThumbnails from './CharacterThumbnails.vue'
  import { useAppStore } from '@/MainGenerator/stores/'

  const appStore = useAppStore()
  const base = computed(() => appStore.data.displaySettings.base)
</script>
