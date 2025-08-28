<!-- src/MainGenerator/components/ViewBotMessage.vue -->
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

        <!-- キャラクター（通常表示モード） -->
        <CharacterAvatar
          v-if="!showCharacterPersistent"
          :profile-image="message.profileImage"
          :character-name="message.name"
          :background-color="message.color?.backgroundColor"
          :show-character-frame="showCharacterFrame"
          :is-visible="index === 0"
          :display-size="displaySize"
          @image-error="handleImageError(message)"
        />
      </MotionWrapper>
    </div>

    <!-- 常時表示キャラクター -->
    <CharacterAvatar
      v-if="showCharacterPersistent && currentCharacter"
      :profile-image="currentCharacter.profileImage"
      :character-name="currentCharacter.name"
      :background-color="currentCharacter.color?.backgroundColor"
      :show-character-frame="showCharacterFrame"
      :is-visible="true"
      :display-size="displaySize"
      @image-error="handleImageError(currentCharacter)"
    />
  </div>
</template>

<script setup lang="ts">
  import { computed, onMounted, onUnmounted } from 'vue'
  import { useAppStore, useDisplayStore } from '@/MainGenerator/stores'
  import { usePersistentCharacterDisplay } from './composables/usePersistentCharacterDisplay'
  import CommentBubble from './CommentBubble.vue'
  import CharacterAvatar from './CharacterAvatar.vue'
  import MotionWrapper from '@MainScripts/MotionVariants/MotionWrapper.vue'
  import { storeToRefs } from 'pinia'

  // サイズ設定の定数
  const SIZE_CONFIG = {
    xs: { text: 'text-md', avatar: 'w-32 h-32', avatarTop: '160px', spacing: 20 },
    sm: { text: 'text-lg', avatar: 'w-48 h-48', avatarTop: '200px', spacing: 40 },
    md: { text: 'text-xl', avatar: 'w-64 h-64', avatarTop: '240px', spacing: 60 },
    lg: { text: 'text-2xl', avatar: 'w-80 h-80', avatarTop: '280px', spacing: 80 },
    xl: { text: 'text-3xl', avatar: 'w-96 h-96', avatarTop: '320px', spacing: 100 },
  } as const

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

  // 常時表示機能対応の表示時間管理（modeパラメータ不要）
  const { displayedComments, getCurrentCharacter, handleImageError, removeComment, start, stop } =
    usePersistentCharacterDisplay(botMessages, showCharacterPersistent)

  // 現在のキャラクター情報
  const currentCharacter = getCurrentCharacter

  // サイズ設定の取得
  const sizeConfig = computed(() => SIZE_CONFIG[displaySize.value])

  // brightness計算
  const getBrightness = (index: number) => Math.max(100 - index * 15, 30)

  onMounted(() => {
    start()
  })
  onUnmounted(stop)
</script>
