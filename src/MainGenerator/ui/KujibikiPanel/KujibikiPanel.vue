<!-- src/MainGenerator/ui/KujibikiPanel/KujibikiPanel.vue -->
<template>
  <CenteringWrapper>
    <KujibikiPanelSelector :settings="settings" :messages="activeMessages" />
  </CenteringWrapper>
</template>

<script setup lang="ts">
  import { computed, onMounted, onUnmounted } from 'vue'
  import { KujibikiPanelSchema } from '@/types'
  import KujibikiPanelSelector from './parts/KujibikiPanelSelector.vue'
  import { useFilteredBotMessages } from '../common/useFilteredBotMessages'
  import CenteringWrapper from '../common/CenteringWrapper.vue'
  import { useAppStore } from '@main/stores/useAppStore'
  import { useBotDisplay } from '@main/ui/CommentBubble/composables/useBotDisplay'

  const appStore = useAppStore()
  const settings = computed(() => KujibikiPanelSchema.parse(appStore.data.components?.settings?.kujibikiPanel ?? {}))

  const { messages } = useFilteredBotMessages('kujibikiPanel', {
    displaySeconds: settings.value.displaySeconds,
    userIconSize: 12,
  })

  // displaySeconds === 0 → 常時表示（常に最新メッセージ1件を直接参照）
  // displaySeconds !== 0 → useBotDisplay 経由でタイムアウト管理
  const isAlwaysOn = computed(() => settings.value.displaySeconds === 0)

  const { displayedComments, start, stop } = useBotDisplay(messages)

  // 常時表示モードでは messages の最新1件、そうでなければ displayedComments を使用
  const activeMessages = computed(() => (isAlwaysOn.value ? messages.value.slice(-1) : displayedComments.value))

  onMounted(() => {
    if (!isAlwaysOn.value) start()
  })

  onUnmounted(() => {
    if (!isAlwaysOn.value) stop()
  })
</script>
