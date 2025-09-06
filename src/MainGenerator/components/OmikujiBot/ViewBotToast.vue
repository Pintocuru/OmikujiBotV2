<!-- src/MainGenerator/components/ViewBotToast.vue -->
<template>
  <div v-for="(message, index) in displayedComments.slice().reverse()" :key="message.id">
    <MotionWrapper
      v-model:visible="message.visible"
      :enter-motion="'slideLeft'"
      :leave-motion="'slideRight'"
      :auto-hide="false"
      @after-leave="() => removeComment(message.id)"
    >
      <ChatBubbleItem
        :message="message"
        :character="characters?.[message.characterKey]"
        :displaySize="displaySize"
        :clickable="true"
        @click="hideComment"
      />
    </MotionWrapper>
  </div>
</template>

<script setup lang="ts">
  import { computed, onMounted, onUnmounted } from 'vue'
  import ChatBubbleItem from './ChatBubbleItem.vue'
  import { useBotDisplay } from './composables/useBotDisplay'
  import { useAppStore, useDisplayStore } from '@/MainGenerator/stores'
  import MotionWrapper from '@MainScripts/MotionVariants/MotionWrapper.vue'
  import { storeToRefs } from 'pinia'

  // ストアから必要な情報を取得
  const appStore = useAppStore()
  const displayStore = useDisplayStore()
  const { botMessages } = storeToRefs(appStore)
  const { displaySize } = storeToRefs(displayStore)

  const characters = computed(() => appStore.characterCollector.getUsedCharacterData())

  // コメント表示ロジック
  const { displayedComments, removeComment, hideComment, start, stop } = useBotDisplay(botMessages, 'toast')

  onMounted(start)
  onUnmounted(stop)
</script>
