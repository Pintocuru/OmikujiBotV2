<!-- src/MainGenerator/components/OmikujiBot/PersistentCharacter.vue -->
<template>
  <div class="fixed inset-0 w-full h-screen overflow-hidden pointer-events-none">
    <!-- キャラクター横並び表示 -->
    <div class="absolute bottom-0 left-0 right-0 flex justify-center items-end gap-8 p-4">
      <div
        v-for="character in availableCharacters"
        :key="character.key"
        class="relative flex flex-col items-center pointer-events-auto"
      >
        <!-- キャラクターのコメント表示 -->
        <div
          v-for="(comment, commentIndex) in getCharacterComments(character.key)"
          :key="comment.id"
          class="absolute mb-4"
          :style="{
            bottom: `${(commentIndex + 1) * sizeConfig.spacing + 120}px`,
            zIndex: 1000 - commentIndex,
          }"
        >
          <MotionWrapper
            v-model:visible="comment.visible"
            :enter-motion="enterMotion"
            :leave-motion="leaveMotion"
            :auto-hide="false"
            @after-leave="() => removeComment(comment.id)"
          >
            <CommentBubble
              :name="comment.name"
              :comment="comment.comment"
              :color="comment.color"
              :text-size="displaySize"
              :brightness="100"
              :custom-classes="comment.color?.customClasses"
            />
          </MotionWrapper>
        </div>

        <!-- キャラクターアバター -->
        <CharacterAvatar
          :profile-image="getCharacterImage(character)"
          :character-name="character.data.displayName || character.key"
          :background-color="character.data.color?.backgroundColor"
          :show-character-frame="showCharacterFrame"
          :is-visible="true"
          :display-size="displaySize"
          @image-error="handleImageError(character)"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed, onMounted, onUnmounted, ref } from 'vue'
  import { useAppStore, useDisplayStore } from '@/MainGenerator/stores'
  import { useBotDisplayBase } from './composables/useBotDisplayBase'
  import CommentBubble from './CommentBubble.vue'
  import CharacterAvatar from './CharacterAvatar.vue'
  import MotionWrapper from '@MainScripts/MotionVariants/MotionWrapper.vue'
  import { storeToRefs } from 'pinia'
  import type { BotMessage, CharacterType } from '@/types/'
  import { getImagePath } from '@/types/'

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
  const displaySize = computed(() => displayStore.displaySize)

  // 基底composableを使用
  const { displayedComments, removeComment, start, stop } = useBotDisplayBase(botMessages, 'comment')

  // omikujiDataの設定取得
  const omikujiData = computed(() => appStore.omikujiData)

  const enterMotion = computed(() => {
    return omikujiData.value?.displaySettings?.base?.bubbleMotionEnter
  })

  const leaveMotion = computed(() => {
    return omikujiData.value?.displaySettings?.base?.bubbleMotionLeave
  })

  const showCharacterFrame = computed(() => {
    return omikujiData.value?.displaySettings?.base?.showCharacterFrame
  })

  // サイズ設定の取得
  const sizeConfig = computed(() => SIZE_CONFIG[displaySize.value])

  // storeから利用可能なキャラクターを取得
  const availableCharacters = computed(() => {
    const charactersRecord = omikujiData.value?.characters || {}
    return Object.entries(charactersRecord).map(([key, data]) => ({
      key,
      data,
    }))
  })

  // 指定されたキャラクターの画像を取得
  const getCharacterImage = (character: { key: string; data: CharacterType }) => {
    const imageSet = character.data.image
    if (!imageSet || !imageSet.default) return null
    return getImagePath(imageSet.default)
  }

  // 指定されたキャラクターのコメントを取得
  const getCharacterComments = (characterKey: string) => {
    return displayedComments.value.filter((comment) => comment.characterKey === characterKey && comment.visible)
  }

  // 画像エラーハンドリング
  const handleImageError = (character: { key: string; data: CharacterType }) => {
    console.error(`キャラクター画像が読み込めません: ${character.key}`, {
      characterKey: character.key,
      characterName: character.data.displayName,
      imagePath: getCharacterImage(character),
    })
  }

  onMounted(() => {
    start()
  })

  onUnmounted(() => {
    stop()
  })
</script>
