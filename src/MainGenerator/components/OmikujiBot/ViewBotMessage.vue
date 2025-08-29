<!-- src/MainGenerator/components/OmikujiBot/ViewBotMessage.vue -->
<template>
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
          v-if="!showCharacterPersistent"
          class="absolute left-1/2 -translate-x-1/2 transform"
          :profile-image="message.profileImage"
          :character-name="message.name"
          :background-color="message.color?.backgroundColor"
          :show-character-frame="showCharacterFrame"
          :is-visible="index === 0"
          :display-size="displaySize"
          @image-error="handleImageError(message)"
          :style="{
            top: sizeConfig.avatarTop,
          }"
        />
      </MotionWrapper>
    </template>
  </CommentDisplay>
</template>

<script setup lang="ts">
  import { computed, onMounted, onUnmounted } from 'vue'
  import { useAppStore, useDisplayStore } from '@/MainGenerator/stores'
  import { useBotDisplayBase } from './composables/useBotDisplayBase'
  import CommentDisplay from './CommentDisplay.vue'
  import CharacterAvatar from './CharacterAvatar.vue'
  import MotionWrapper from '@MainScripts/MotionVariants/MotionWrapper.vue'
  import { storeToRefs } from 'pinia'
  import { SIZE_CONFIG } from './composables/SIZE_CONFIG'

  // Piniaストアの使用
  const appStore = useAppStore()
  const displayStore = useDisplayStore()

  // リアクティブ変数
  const { botMessages } = storeToRefs(appStore)
  const omikujiData = computed(() => appStore.omikujiData)
  const displaySize = computed(() => displayStore.displaySize)

  // omikujiDataの深い参照用computed
  const enterMotion = computed(() => {
    return omikujiData.value?.displaySettings?.base?.bubbleMotionEnter
  })

  const leaveMotion = computed(() => {
    return omikujiData.value?.displaySettings?.base?.bubbleMotionLeave
  })

  // キャラクター表示設定
  const showCharacterFrame = computed(() => {
    return omikujiData.value?.displaySettings?.base?.showCharacterFrame
  })

  // キャラクター常時表示設定
  const showCharacterPersistent = computed(() => {
    return omikujiData.value?.displaySettings?.base?.showCharacterPersistent
  })

  // 基底composableを直接使用
  const { displayedComments, handleImageError, removeComment, start, stop } = useBotDisplayBase(botMessages, 'comment')

  // サイズ設定の取得
  const sizeConfig = computed(() => SIZE_CONFIG[displaySize.value])

  // brightness計算
  const getBrightness = (index: number) => Math.max(100 - index * 15, 30)

  onMounted(() => {
    start()
  })
  onUnmounted(stop)
</script>
