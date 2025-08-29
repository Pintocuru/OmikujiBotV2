<!-- src/MainGenerator/components/OmikujiBot/PersistentCharacter.vue -->
<template>
  <div class="relative w-full h-screen">
    <!-- キャラクター横並び表示 -->
    <div class="absolute bottom-0 left-0 right-0 flex justify-center items-end gap-8 p-4">
      <div v-for="character in availableCharacters" :key="character.key" class="relative pointer-events-auto">
        <!-- キャラクターアバター -->
        <div class="relative flex flex-col items-center">
          <CharacterAvatar
            class="flex justify-center items-end"
            :profile-image="getCharacterImage(character)"
            :character-name="character.data.displayName || character.key"
            :background-color="character.data.color?.backgroundColor"
            :show-character-frame="showCharacterFrame"
            :is-visible="true"
            :display-size="displaySize"
            @image-error="handleImageError(character)"
          />

          <!-- キャラクターのコメント表示 -->
          <div
            v-for="(comment, commentIndex) in getCharacterComments(character.key)"
            :key="comment.id"
            class="absolute left-1/2 transform -translate-x-1/2 w-max"
            :style="{
              bottom: `${Number(sizeConfig.avatarTop.replace('px', '')) + commentIndex * sizeConfig.spacing + 20}px`,
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
                :brightness="getBrightness(commentIndex)"
                :custom-classes="comment.color?.customClasses"
              />
            </MotionWrapper>
          </div>
        </div>
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
  import { SIZE_CONFIG } from './composables/SIZE_CONFIG'

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
    return imageSet.default // getImagePathは不要（CharacterAvatar内で処理される）
  }

  // 指定されたキャラクターのコメントを取得
  const getCharacterComments = (characterKey: string) => {
    return displayedComments.value.filter((comment) => comment.characterKey === characterKey && comment.visible)
  }
  // brightness計算
  const getBrightness = (index: number) => Math.max(100 - index * 15, 30)

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
