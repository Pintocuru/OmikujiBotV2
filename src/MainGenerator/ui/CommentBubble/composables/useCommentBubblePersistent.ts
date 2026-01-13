// src/MainGenerator/composables/useCommentBubblePersistent.ts
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useAppStore } from '@main/stores/useAppStore'
import { useCharacterManager } from '@main/scripts/CharacterManager/useCharacterManager'
import { useCharacterSelection } from './useCharacterSelection'
import { useCharacterEmotionState } from './useCharacterEmotionState'
import { useBotDisplay } from './useBotDisplay'
import { BotMessageCommentType } from '@/types'

/**
 * 常時表示キャラクター（1〜4番地）の表示制御
 * 責務を明確に分離:
 * - useCharacterSelection: キャラクター選択ロジック
 * - useCharacterEmotionState: 感情状態管理
 * - useBotDisplay: コメント表示制御
 */
export function useCommentBubblePersistent() {
  const appStore = useAppStore()
  const { botMessages } = storeToRefs(appStore)
  const { charactersMap, showCharacters } = useCharacterManager()
  const isToastEnabled = computed(() => appStore.data.featureUsage.components.includes('toast'))

  // 1-4番地のコメント取得
  const indexMessages = computed(() => {
    const allowKeys = [
      ...showCharacters.value.slot1,
      ...showCharacters.value.slot2,
      ...showCharacters.value.slot3,
      ...showCharacters.value.slot4,
    ]

    // centerが空の場合は何も表示しない
    if (allowKeys.length === 0) return []

    return botMessages.value.filter((message): message is BotMessageCommentType => {
      if (message.type !== 'comment') return false
      if (isToastEnabled.value && message.bubble?.isToast) return false

      // null の場合はキャラクター非表示モードなのでそのまま表示させる
      if (message.bubble?.characterKey === null) return true
      return allowKeys.includes(message.bubble?.characterKey)
    })
  })

  // コメント表示制御
  const { displayedComments, removeComment, start, stop } = useBotDisplay(indexMessages)

  // キャラクター選択
  const { latestCommenterKey, slotCharacters } = useCharacterSelection(displayedComments, showCharacters, charactersMap)

  // 感情状態管理
  const { emotionStates, getCharacterLayers, updateCharacterEmotion } = useCharacterEmotionState(
    displayedComments,
    charactersMap
  )

  // 設定取得
  const bubble = computed(() => appStore.data.components.bubble || {})

  // コメント削除時に感情状態も更新
  const removeCommentWithEmotionUpdate = (messageId: string, characterKey?: string) => {
    removeComment(messageId)

    // 特定キャラクターの感情のみ更新
    if (characterKey) updateCharacterEmotion(characterKey)
  }

  // 指定キャラクターのコメントを取得（表示中のみ）
  const getCharacterComments = (characterKey: string) => {
    return displayedComments.value.filter((c) => c.bubble?.characterKey === characterKey && c.display?.visible)
  }

  return {
    // キャラクター情報
    slotCharacters,
    latestCommenterKey,

    // 感情状態
    emotionStates,
    getCharacterLayers,

    // コメント関連
    displayedComments,
    getCharacterComments,
    removeCommentWithEmotionUpdate,

    // 設定
    enterMotion: computed(() => bubble.value.bubbleMotionEnter),
    bubble,

    // ライフサイクル
    start,
    stop,
  }
}
