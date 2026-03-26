<!-- src/MainGenerator/ui/ToastWidgets/ViewBotToast.vue -->
<template>
  <div :class="!toastSettings.showToastsOnRight ? 'self-start' : 'self-end'">
    <div v-for="message in displayedComments.slice().reverse()" :key="message.id">
      <!-- ! を使用… -->
      <MotionWrapper
        v-model:visible="message.display!.visible"
        :motion="!toastSettings.showToastsOnRight ? 'slideRight' : 'slideLeft'"
        :leave-motion="!toastSettings.showToastsOnRight ? 'slideLeft' : 'slideRight'"
        :auto-hide="false"
        @after-leave="() => removeComment(message.id)"
      >
        <ToastBubbleItem
          :key="message.id"
          :message="message.bubble?.message"
          :color="getCharacterColor(message.bubble.characterKey)"
          :iconLayers="
            isCharacter && toastSettings.showToastsCharacter && message.bubble
              ? iconSrc(message.bubble.characterKey, message.bubble.iconKey)
              : []
          "
          :showToastsOnRight="toastSettings.showToastsOnRight"
          :getProfileImage="(userId) => appStore.userSession.stats.get(userId)?.profileImage"
          @click="hideComment(message.id)"
        />
      </MotionWrapper>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed, onMounted, onUnmounted } from 'vue'
  import { storeToRefs } from 'pinia'
  import ToastBubbleItem from './parts/ToastBubbleItem.vue'
  import { useBotDisplay } from '../CommentBubble/composables/useBotDisplay'
  import { useAppStore } from '@main/stores/useAppStore'
  import MotionWrapper from '@main/scripts/MotionVariants/MotionWrapper.vue'
  import { useVisibilityAccess } from '@main/scripts/FeatureAccess/useAccessCheckerMain'
  import { useCharacterManager } from '@main/scripts/CharacterManager/useCharacterManager'
  import { ToastWidgetsSchema } from '@/types'
  import { useFilteredBotMessages } from '../common/useFilteredBotMessages'

  // ストアから必要な情報を取得
  const appStore = useAppStore()
  const { data } = storeToRefs(appStore)
  const toastSettings = computed(() => data.value.components.settings.toast ?? ToastWidgetsSchema.parse({}))
  const { iconSrc, getCharacterColor } = useCharacterManager()

  // ライセンス状態で閲覧できないなら表示させない
  const { isCharacter } = useVisibilityAccess()
  const { messages } = useFilteredBotMessages('toast')

  // コメント表示ロジック
  const { displayedComments, removeComment, hideComment, start, stop } = useBotDisplay(messages)

  onMounted(start)
  onUnmounted(stop)
</script>
