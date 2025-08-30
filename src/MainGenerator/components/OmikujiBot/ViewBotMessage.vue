<!-- src/MainGenerator/components/OmikujiBot/ViewBotMessage.vue -->
<template>
  <div class="relative h-screen">
    <div class="absolute w-full" :style="{ bottom: sizeConfig.avatarTop }">
      <!-- コメント表示 -->
      <CommentDisplay
        :displayed-comments="displayedComments"
        :remove-comment="removeComment"
        :enter-motion="enterMotion"
        :leave-motion="leaveMotion"
        :text-size="displaySize"
        mode="stack"
        :spacing="sizeConfig.spacing"
      >
        <template #default="{ message, index }">
          <!-- キャラクター（通常表示モードのみ） -->
          <MotionWrapper :enter-motion="message.enterMotion" :auto-hide="false">
            <CharacterAvatar
              class="absolute top-[80px] top-1/2 left-1/2 -translate-x-1/2 transform"
              :profile-image="message.profileImage"
              :character-name="message.name"
              :background-color="message.color?.backgroundColor"
              :show-character-frame="showCharacterFrame"
              :is-visible="index === 0"
              :display-size="displaySize"
              @image-error="handleImageError(message)"
            />
          </MotionWrapper>
        </template>
      </CommentDisplay>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed, onMounted } from 'vue'
  import { useAppStore, useDisplayStore } from '@/MainGenerator/stores'
  import { useBotDisplay } from './composables/useBotDisplay'
  import CommentDisplay from './CommentDisplay.vue'
  import CharacterAvatar from './CharacterAvatar.vue'
  import MotionWrapper from '@MainScripts/MotionVariants/MotionWrapper.vue'
  import { storeToRefs } from 'pinia'
  import { SIZE_CONFIG } from './composables/SizeConfig'

  // Piniaストアの使用
  const appStore = useAppStore()
  const displayStore = useDisplayStore()

  // リアクティブ変数
  const { botMessages } = storeToRefs(appStore)
  const { displaySize } = storeToRefs(displayStore)
  const base = computed(() => appStore.omikujiData.displaySettings?.base || {})

  // サイズ設定
  const sizeConfig = computed(() => SIZE_CONFIG[displaySize.value])

  // アニメーション設定
  const enterMotion = computed(() => base.value?.bubbleMotionEnter)
  const leaveMotion = computed(() => base.value?.bubbleMotionLeave)

  // キャラクター表示設定
  const showCharacterFrame = computed(() => base.value?.showCharacterFrame)

  // 基底composableを直接使用
  const { displayedComments, handleImageError, removeComment, start } = useBotDisplay(botMessages, 'comment')

  onMounted(() => start())
</script>
