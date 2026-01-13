// src/MainGenerator/composables/useCharacterEmotionState.ts
import { ref, computed, watch, type Ref } from 'vue'
import type { BotMessageCommentType, BotMessageType, CharacterEmotionType, CharacterType } from '@/types/'

/**
 * キャラクターの感情状態（アイコン）を管理
 * - 各キャラクターの現在の感情を追跡
 * - コメントに基づいて感情を自動更新
 */
export function useCharacterEmotionState(
  displayedComments: Ref<BotMessageCommentType[]>,
  charactersMap: Ref<Record<string, CharacterType>>
) {
  // キャラクターごとの現在の感情状態
  const emotionStates = ref<Record<string, CharacterEmotionType>>({})

  // キャラクターごとの画像レイヤー（computed化）
  const characterLayers = computed(() => {
    const result: Record<string, string[]> = {}

    Object.keys(charactersMap.value).forEach((characterKey) => {
      const character = charactersMap.value[characterKey]
      if (!character) {
        result[characterKey] = []
        return
      }

      const currentEmotion = emotionStates.value[characterKey] || 'default'
      result[characterKey] = character.image[currentEmotion] || character.image.default || []
    })

    return result
  })

  // 指定キャラクターの表示中コメント一覧
  const getVisibleComments = (characterKey: string): BotMessageType[] => {
    return displayedComments.value.filter((m) => m.bubble?.characterKey === characterKey && m.display?.visible)
  }

  // 指定キャラクターの最新の感情を取得
  const getLatestEmotion = (characterKey: string): CharacterEmotionType => {
    const comments = getVisibleComments(characterKey)
    if (comments.length === 0) return 'default'
    const latestComment = comments[0]
    if (latestComment.type !== 'comment' || !latestComment.bubble) return 'default'
    return latestComment.bubble.iconKey ?? 'default'
  }

  // 全キャラクターの感情状態を更新
  const updateAllEmotions = () => {
    const characterKeys = Object.keys(charactersMap.value)
    const newStates: Record<string, CharacterEmotionType> = {}

    characterKeys.forEach((key) => {
      newStates[key] = getLatestEmotion(key)
    })

    // 一括で更新することでリアクティビティを確実にトリガー
    emotionStates.value = newStates
  }

  // 特定キャラクターの感情状態のみ更新
  const updateCharacterEmotion = (characterKey: string) => {
    // オブジェクト全体を再割り当てしてリアクティビティを確実にトリガー
    emotionStates.value = {
      ...emotionStates.value,
      [characterKey]: getLatestEmotion(characterKey),
    }
  }

  // 指定キャラクターの現在の画像レイヤーを取得
  const getCharacterLayers = (characterKey: string): string[] => {
    return characterLayers.value[characterKey] || []
  }

  // displayedCommentsが変更されたら全キャラクターの感情を更新
  watch(
    () => displayedComments.value,
    () => {
      updateAllEmotions()
    },
    { deep: true }
  )

  // 初期化時に一度実行
  updateAllEmotions()

  return {
    emotionStates: computed(() => emotionStates.value),
    getVisibleComments,
    getCharacterLayers,
    updateCharacterEmotion,
    updateAllEmotions,
  }
}
