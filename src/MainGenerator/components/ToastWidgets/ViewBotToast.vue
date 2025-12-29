<!-- src/MainGenerator/components/ViewBotToast.vue -->
<template>
  <div :class="!toastSettings.showToastsOnRight ? 'self-start' : 'self-end'">
    <div v-for="message in displayedComments.slice().reverse()" :key="message.id">
      <MotionWrapper
        v-model:visible="message.visible"
        :motion="!toastSettings.showToastsOnRight ? 'slideRight' : 'slideLeft'"
        :leave-motion="!toastSettings.showToastsOnRight ? 'slideLeft' : 'slideRight'"
        :auto-hide="false"
        @after-leave="() => removeComment(message.id)"
      >
        <ToastBubbleItem
          :key="message.id"
          :message="message.message.toast ?? '(未記入)'"
          :color="message.color"
          :iconLayers="
            isCharacter && toastSettings.showToastsCharacter ? iconSrc(message.characterKey, message.iconKey) : []
          "
          :showToastsOnRight="toastSettings.showToastsOnRight"
          @click="hideComment(message.id)"
        />
      </MotionWrapper>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed, onMounted, onUnmounted } from 'vue'
  import { storeToRefs } from 'pinia'
  import ToastBubbleItem from './ToastBubbleItem.vue'
  import { useBotDisplay } from '../CommentBubble/composables/useBotDisplay'
  import { useAppStore } from '@/MainGenerator/stores/useAppStore'
  import MotionWrapper from '@MainScripts/MotionVariants/MotionWrapper.vue'
  import { useVisibilityAccess } from '@/MainGenerator/scripts/FeatureAccess/useAccessCheckerMain'
  import { useCharacterManager } from '@/MainGenerator/scripts/CharacterManager/useCharacterManager'

  // ストアから必要な情報を取得
  const appStore = useAppStore()
  const { data, botMessages } = storeToRefs(appStore)
  const toastSettings = computed(() => data.value.components.toast)
  const { iconSrc } = useCharacterManager()

  // ライセンス状態で閲覧できないなら表示させない
  const { isCharacter } = useVisibilityAccess()

  // コメント表示ロジック
  const { displayedComments, removeComment, hideComment, start, stop } = useBotDisplay(botMessages, 'toast')

  onMounted(start)
  onUnmounted(stop)
</script>
