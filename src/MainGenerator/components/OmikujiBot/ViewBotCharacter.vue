<!-- src/MainGenerator/components/OmikujiBot/ViewBotCharacter.vue -->
<template>
  <!-- キャラクター横並び表示 -->
  <div class="absolute bottom-0 left-0 right-0 flex justify-center items-end">
    <div
      v-for="character in availableCharacters"
      :key="character.key"
      class="relative pointer-events-auto -mx-4"
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
          :remove-comment="(messageId) => removeCommentWithIconReset(messageId, character.key)"
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
  import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
  import type { CharacterType, CharacterEmotionType } from '@/types/'
  import { useAppStore, useDisplayStore } from '@/MainGenerator/stores'
  import { useBotDisplayBase } from './composables/useBotDisplayBase'
  import CommentDisplay from './CommentDisplay.vue'
  import CharacterAvatar from './CharacterAvatar.vue'
  import { SIZE_CONFIG } from './composables/SIZE_CONFIG'
  import { storeToRefs } from 'pinia'

  // Piniaストアの使用
  const appStore = useAppStore()
  const displayStore = useDisplayStore()

  // リアクティブ変数
  const { botMessages } = storeToRefs(appStore)
  const displaySize = computed(() => displayStore.displaySize)

  // キャラクターごとの現在のアイコン状態を管理
  const characterIconStates = ref<Record<string, CharacterEmotionType>>({})

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

  // 指定されたキャラクターの感情に応じた画像を取得
  const getCharacterImage = (character: { key: string; data: CharacterType }) => {
    const imageSet = character.data.image
    if (!imageSet) return null

    // 現在のアイコン状態を確認
    const currentIconKey = characterIconStates.value[character.key] || 'default'

    // 指定された感情の画像があるかチェック
    const emotionImage = imageSet[currentIconKey]
    if (emotionImage) {
      return emotionImage
    }

    // 指定された感情の画像がない場合はdefaultを使用
    return imageSet.default || null
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

  // キャラクターアイコンの状態を更新
  const updateCharacterIconState = () => {
    // 各キャラクターの最新のコメントをチェック
    availableCharacters.value.forEach((character) => {
      const characterComments = getCharacterComments(character.key)

      if (characterComments.length > 0) {
        // 最新のコメント（配列の最初の要素）を取得
        const latestComment = characterComments[0]
        const iconKey = latestComment.iconKey || 'default'

        // アイコン状態を更新（defaultでない場合のみでなく、常に更新）
        characterIconStates.value[character.key] = iconKey
      } else {
        // コメントがない場合はdefaultに戻す
        characterIconStates.value[character.key] = 'default'
      }
    })
  }

  // コメント削除時にアイコンをリセット
  const removeCommentWithIconReset = (messageId: string, characterKey: string) => {
    // まず通常のremoveCommentを実行
    removeComment(messageId)

    // そのキャラクターの残りのコメントをチェック
    const remainingComments = getCharacterComments(characterKey)

    if (remainingComments.length === 0) {
      // 残りのコメントがない場合、defaultに戻す
      characterIconStates.value[characterKey] = 'default'
    } else {
      // 残りのコメントがある場合、最新のコメントのiconKeyを適用
      const latestComment = remainingComments[0]
      const iconKey = latestComment.iconKey || 'default'
      characterIconStates.value[characterKey] = iconKey
    }
  }

  // 画像エラーハンドリング
  const handleImageError = (character: { key: string; data: CharacterType }) => {
    console.error(`キャラクター画像が読み込めません: ${character.key}`, {
      characterKey: character.key,
      characterName: character.data.displayName,
      imagePath: getCharacterImage(character),
    })
  }

  // displayedCommentsの変化を監視してアイコン状態を更新
  watch(
    displayedComments,
    () => {
      updateCharacterIconState()
    },
    { deep: true, immediate: true }
  )

  onMounted(() => start())
  onUnmounted(() => stop())
</script>
