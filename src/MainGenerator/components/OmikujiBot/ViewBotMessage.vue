<!-- src/MainGenerator/components/OmikujiBot/ViewBotMessage.vue -->
<template>
  <div class="relative w-full h-screen overflow-hidden">
    <!-- コメント表示部分 -->
    <div
      v-for="(message, index) in displayedComments"
      :key="message.id"
      class="absolute w-full max-w-3xl mx-auto"
      :style="{
        left: '0',
        right: '0',
        top: `${index * sizeConfig.spacing}px`,
        zIndex: displayedComments.length - index,
      }"
    >
      <MotionWrapper
        v-model:visible="message.visible"
        :enter-motion="enterMotion"
        :leave-motion="leaveMotion"
        :auto-hide="false"
        @after-leave="() => removeComment(message.id)"
      >
        <div class="flex justify-center">
          <!-- コメント表示 -->
          <CommentBubble
            :name="message.name"
            :comment="message.comment"
            :color="message.color"
            :text-size="displaySize"
            :brightness="getBrightness(index)"
            :custom-classes="message.color?.customClasses"
          />
        </div>

        <!-- キャラクター（通常表示モードのみ） -->
        <CharacterAvatar
          v-if="!showCharacterPersistent"
          class="absolute left-1/2 -translate-x-1/2 transform z-40"
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
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed, onMounted, onUnmounted } from 'vue'
  import { useAppStore, useDisplayStore } from '@/MainGenerator/stores'
  import { useBotDisplayBase } from './composables/useBotDisplayBase'
  import CommentBubble from './CommentBubble.vue'
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
