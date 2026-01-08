<!-- src/MainGenerator/components/ViewBotToast.vue -->
<template>
  <div :class="!toastSettings.showToastsOnRight ? 'self-start' : 'self-end'">
    <div v-for="message in filteredToastComments.slice().reverse()" :key="message.id">
      <MotionWrapper
        v-model:visible="message.visible"
        :motion="!toastSettings.showToastsOnRight ? 'slideRight' : 'slideLeft'"
        :leave-motion="!toastSettings.showToastsOnRight ? 'slideLeft' : 'slideRight'"
        :auto-hide="false"
        @after-leave="() => removeComment(message.id)"
      >
        <!-- TODO:toast使用してるので変更させて -->
        <ToastBubbleItem
          :key="message.id"
          :message="message.bubble?.isToast ? (message.bubble?.message ?? '(未記入)') : ''"
          :color="message.bubble?.color ?? CharacterColorScheme.parse({})"
          :iconLayers="
            isCharacter && toastSettings.showToastsCharacter && message.bubble
              ? iconSrc(message.bubble.characterKey, message.bubble.iconKey)
              : []
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
  import ToastBubbleItem from '@/common/ui/ToastWidgets/ToastBubbleItem.vue'
  import { useBotDisplay } from '../CommentBubble/composables/useBotDisplay'
  import { useAppStore } from '@main/stores/useAppStore'
  import MotionWrapper from '@main/scripts/MotionVariants/MotionWrapper.vue'
  import { useVisibilityAccess } from '@main/scripts/FeatureAccess/useAccessCheckerMain'
  import { useCharacterManager } from '@main/scripts/CharacterManager/useCharacterManager'
  import { CharacterColorScheme } from '@/types'

  // ストアから必要な情報を取得
  const appStore = useAppStore()
  const { data, botMessages } = storeToRefs(appStore)
  const toastSettings = computed(() => data.value.components.toast)
  const { iconSrc } = useCharacterManager()

  // ライセンス状態で閲覧できないなら表示させない
  const { isCharacter } = useVisibilityAccess()

  // コメント表示ロジック
  const { displayedComments, removeComment, hideComment, start, stop } = useBotDisplay(botMessages, 'toast')

  const filteredToastComments = computed(() =>
    displayedComments.value.filter((message) => message.bubble?.isToast !== false)
  )

  onMounted(start)
  onUnmounted(stop)
</script>
