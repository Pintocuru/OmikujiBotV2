<!-- src/MainGenerator/components/ViewBotToast.vue -->
<template>
  <div v-for="(message, index) in displayedComments.slice().reverse()" :key="message.id">
    <MotionWrapper
      v-model:visible="message.visible"
      :initialMotion="!toast.showToastsOnRight ? 'slideRight' : 'slideLeft'"
      :enterMotion="!toast.showToastsOnRight ? 'slideRight' : 'slideLeft'"
      :leave-motion="!toast.showToastsOnRight ? 'slideLeft' : 'slideRight'"
      :auto-hide="false"
      @after-leave="() => removeComment(message.id)"
    >
      <ToastBubbleItem
        :botMessage="message"
        :showToastsOnRight="toast.showToastsOnRight"
        :character="characters?.[message.characterKey]"
        :isCharacterDisplay="toast.showToastsCharacter"
        :clickable="true"
        @click="hideComment"
      />
    </MotionWrapper>
  </div>
</template>

<script setup lang="ts">
  import { computed, onMounted, onUnmounted } from 'vue'
  import ToastBubbleItem from './ToastBubbleItem.vue'
  import { useBotDisplay } from '../CommentBubble/composables/useBotDisplay'
  import { useAppStore } from '@/MainGenerator/stores/useAppStore'
  import MotionWrapper from '@MainScripts/MotionVariants/MotionWrapper.vue'
  import { storeToRefs } from 'pinia'

  // ストアから必要な情報を取得
  const appStore = useAppStore()
  const { botMessages } = storeToRefs(appStore)
  const toast = computed(() => appStore.data.displaySettings.components.toast)

  const characters = computed(() => appStore.characterCollector.getUsedCharacterData())

  // コメント表示ロジック
  const { displayedComments, removeComment, hideComment, start, stop } = useBotDisplay(botMessages, 'toast')

  onMounted(start)
  onUnmounted(stop)
</script>
