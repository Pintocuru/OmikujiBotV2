// src/MainGenerator/components/OmikujiBot/composables/useViewBotCharacter.ts
import { computed, ref, watch } from 'vue'
import type { CharacterType, CharacterEmotionType } from '@/types/'
import { useAppStore, useDisplayStore } from '@/MainGenerator/stores'
import { useBotDisplay } from './useBotDisplay'
import { SIZE_CONFIG } from './SIZE_CONFIG'
import { storeToRefs } from 'pinia'

export function useViewBotCharacter() {
  // Piniaストアの使用
  const appStore = useAppStore()
  const displayStore = useDisplayStore()

  // リアクティブ変数
  const { botMessages } = storeToRefs(appStore)
  const { displaySize } = storeToRefs(displayStore)

  // キャラクターごとの現在のアイコン状態を管理
  const characterIconStates = ref<Record<string, CharacterEmotionType>>({})

  // 基底composableを使用
  const { displayedComments, removeComment, start, stop } = useBotDisplay(botMessages, 'comment')

  // omikujiDataの設定取得
  const base = computed(() => appStore.omikujiData.displaySettings?.base || {})
  const enterMotion = computed(() => base.value.bubbleMotionEnter)
  const leaveMotion = computed(() => base.value.bubbleMotionLeave)
  const showCharacterFrame = computed(() => base.value.showCharacterFrame)

  // サイズ設定の取得
  const sizeConfig = computed(() => SIZE_CONFIG[displaySize.value])

  // storeから利用可能なキャラクターを取得（データ変換不要）
  const availableCharacters = computed(() => {
    return appStore.characterCollector.getUsedCharacterData() || {}
  })

  // 指定されたキャラクターの感情に応じた画像を取得
  const getCharacterImage = (character: CharacterType) => {
    const imageSet = character.image
    if (!imageSet) return null

    // 現在のアイコン状態を確認
    const currentIconKey = characterIconStates.value[character.key] || 'default'

    // 指定された感情の画像があるかチェック
    const emotionImage = imageSet[currentIconKey]
    if (emotionImage) return emotionImage

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
    const characters = availableCharacters.value
    Object.entries(characters).forEach(([key, character]) => {
      const characterComments = getCharacterComments(key)

      if (characterComments.length > 0) {
        // 最新のコメント（配列の最初の要素）を取得
        const latestComment = characterComments[0]
        const iconKey = latestComment.iconKey || 'default'

        // アイコン状態を更新（defaultでない場合のみでなく、常に更新）
        characterIconStates.value[key] = iconKey
      } else {
        // コメントがない場合はdefaultに戻す
        characterIconStates.value[key] = 'default'
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
  const handleImageError = (character: CharacterType) => {
    console.error(`キャラクター画像が読み込めません: ${character.key}`, {
      characterKey: character.key,
      characterName: character.displayName,
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

  return {
    // データ
    availableCharacters,
    characterIconStates,
    displayedComments,

    // 設定
    enterMotion,
    leaveMotion,
    showCharacterFrame,
    sizeConfig,

    // 計算済みプロパティ
    lastCommenterKey,

    // メソッド
    getCharacterImage,
    getCharacterComments,
    removeCommentWithIconReset,
    handleImageError,
    start,
    stop,
  }
}
