// src/MainGenerator/components/OmikujiBot/composables/useViewBotCharacter.ts
import { computed, ref, watch } from 'vue'
import type { CharacterType, CharacterEmotionType } from '@/types/'
import { useAppStore } from '@/MainGenerator/stores/useAppStore'
import { useBotDisplay } from './useBotDisplay'
import { storeToRefs } from 'pinia'

export function useViewBotCharacter() {
  // Piniaストアの使用
  const appStore = useAppStore()

  // リアクティブ変数
  const { botMessages } = storeToRefs(appStore)

  // キャラクターごとの現在のアイコン状態を管理
  const characterIconStates = ref<Record<string, CharacterEmotionType>>({})

  // 基底composableを使用
  const { displayedComments, removeComment, start, stop } = useBotDisplay(botMessages, 'comment')

  // omikujiDataの設定取得
  const base = computed(() => appStore.data.displaySettings?.components.bubble || {})
  const enterMotion = computed(() => base.value.bubbleMotionEnter)
  const leaveMotion = computed(() => base.value.bubbleMotionLeave)
  const showCharacterFrame = computed(() => base.value.showCharacterFrame)

  // サイズ設定の取得
  const sizeConfig = {
    text: 'text-lg',
    avatar: 'w-48',
    spacing: 40,
    avatarBottom: `${200 + 240}px`,
    commentAreaBottom: `${192 + 100}px`,
    characterMargin: '-16px',
  }

  // storeから利用可能なキャラクターを取得
  const availableCharacters = computed(() => {
    return appStore.characterCollector.getUsedCharacterArray() || []
  })

  // 指定されたキャラクターの感情に応じた画像を取得
  const getCharacterImage = (character: CharacterType): string[] | string | null => {
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
  const toList = <T>(v: T[] | Record<string, T> | null | undefined): T[] => {
    return Array.isArray(v) ? v : Object.values(v ?? {})
  }
  const updateCharacterIconState = () => {
    const list = toList(availableCharacters.value)
    list.forEach((ch: CharacterType) => {
      const key = ch.key
      const latest = getCharacterComments(key)[0]
      characterIconStates.value[key] = latest?.iconKey ?? 'default'
    })
  }

  // コメント削除時にアイコンをリセット
  const removeCommentWithIconReset = (messageId: string, characterKey?: string) => {
    // まず通常のremoveCommentを実行
    removeComment(messageId)

    // characterKeyが指定されている場合のみアイコンリセット処理を実行
    if (characterKey) {
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
    } else {
      // characterKeyが指定されていない場合（統合モード）、すべてのキャラクターの状態を更新
      updateCharacterIconState()
    }
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
    start,
    stop,
  }
}
