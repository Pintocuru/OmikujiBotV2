<!-- src/MainGenerator/components/OmikujiBot/PersistentCharacter.vue -->
<template>
  <!-- キャラクター横並び表示 -->
  <div class="absolute bottom-0 left-0 right-0 flex justify-center items-end">
    <div
      v-for="character in availableCharacters"
      :key="character.key"
      class="relative pointer-events-auto -mx-12"
      :style="{
        zIndex: character.key === lastCommenterKey ? 50 : 0,
        filter: character.key === lastCommenterKey ? 'brightness(100%)' : 'brightness(60%)',
      }"
    >
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

        <!-- コメント表示 -->
        <CommentDisplay
          :displayed-comments="getCharacterComments(character.key)"
          :remove-comment="removeComment"
          :enter-motion="enterMotion"
          :leave-motion="leaveMotion"
          :text-size="displaySize"
          mode="persistent"
          :spacing="sizeConfig.spacing"
          :avatar-top="sizeConfig.avatarTop"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed, onMounted, onUnmounted, ref } from 'vue'
  import { useAppStore, useDisplayStore } from '@/MainGenerator/stores'
  import { useBotDisplayBase } from './composables/useBotDisplayBase'
  import CommentDisplay from './CommentDisplay.vue'
  import CharacterAvatar from './CharacterAvatar.vue'
  import MotionWrapper from '@MainScripts/MotionVariants/MotionWrapper.vue'
  import { storeToRefs } from 'pinia'
  import type { CharacterType } from '@/types/'
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
  const displayBase = computed(() => appStore.omikujiData.displaySettings?.base || {})
  const enterMotion = computed(() => displayBase.value.bubbleMotionEnter)
  const leaveMotion = computed(() => displayBase.value.bubbleMotionLeave)
  const showCharacterFrame = computed(() => displayBase.value.showCharacterFrame)

  // サイズ設定の取得
  const sizeConfig = computed(() => SIZE_CONFIG[displaySize.value])

  // storeから利用可能なキャラクターを取得
  const availableCharacters = computed(() => {
    const charactersRecord = appStore.characterCollector.getUsedCharacterData() || {}
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

  // 最後にコメントしたキャラクターのキー
  const lastCommenterKey = computed(() => {
    const visibleComments = displayedComments.value.filter((c) => c.visible)
    const latestComment = visibleComments[0]
    return latestComment?.characterKey
  })

  // 画像エラーハンドリング
  const handleImageError = (character: { key: string; data: CharacterType }) => {
    console.error(`キャラクター画像が読み込めません: ${character.key}`, {
      characterKey: character.key,
      characterName: character.data.displayName,
      imagePath: getCharacterImage(character),
    })
  }

  onMounted(() => start())
  onUnmounted(() => stop())
</script>
