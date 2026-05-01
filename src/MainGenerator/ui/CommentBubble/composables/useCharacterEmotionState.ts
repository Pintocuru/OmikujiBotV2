// src/MainGenerator/ui/CommentBubble/composables/useCharacterEmotionState.ts
import { ref, computed, watch, type Ref } from 'vue'
import type { BotMessageBubbleType, BotMessageType, CharacterType } from '@/types'

/**
 * キャラクターの感情状態（アイコン）を管理
 * - 各キャラクターの現在の感情を追跡
 * - コメントに基づいて感情を自動更新
 */
export function useCharacterEmotionState(
  displayedComments: Ref<BotMessageBubbleType[]>,
  charactersMap: Ref<Record<string, CharacterType>>
) {
  // キャラクターごとの現在の感情状態
  const emotionStates = ref<Record<string, string>>({})

  // キャラクターごとの画像レイヤー（computed化）
  const characterLayers = computed(() => {
    const result: Record<string, string[]> = {}

    Object.keys(charactersMap.value).forEach((characterKey) => {
      const character = charactersMap.value[characterKey]
      if (!character) {
        result[characterKey] = []
        return
      }

      const currentEmotion = emotionStates.value[characterKey] ?? 'default'
      const image = character.image

      // 指定感情のsrc → defaultのsrc → 最初の有効なsrc の順でフォールバック
      const getSrc = (key: string) => image?.[key]?.src.filter((p) => p?.trim()) ?? []

      const target = getSrc(currentEmotion)
      if (target.length > 0) {
        result[characterKey] = target
        return
      }

      const defaultSrc = getSrc('default')
      if (defaultSrc.length > 0) {
        result[characterKey] = defaultSrc
        return
      }

      for (const item of Object.values(image ?? {})) {
        const src = item?.src.filter((p) => p?.trim()) ?? []
        if (src.length > 0) {
          result[characterKey] = src
          return
        }
      }

      result[characterKey] = []
    })

    return result
  })

  // 指定キャラクターの表示中コメント一覧
  const getVisibleComments = (characterKey: string): BotMessageType[] => {
    return displayedComments.value.filter((m) => m.bubble?.characterKey === characterKey && m.display?.visible)
  }

  // 指定キャラクターの最新の感情を取得
  const getLatestEmotion = (characterKey: string): string => {
    const comments = getVisibleComments(characterKey)
    if (comments.length === 0) return 'default'
    const latestComment = comments[0]
    if (latestComment.type !== 'comment' || !latestComment.bubble) return 'default'
    return latestComment.bubble.iconKey ?? 'default'
  }

  // 全キャラクターの感情状態を更新
  const updateAllEmotions = () => {
    const newStates: Record<string, string> = {}
    Object.keys(charactersMap.value).forEach((key) => {
      newStates[key] = getLatestEmotion(key)
    })
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

  // キャラクターの現在感情のアニメーション設定を取得
  const getCharacterAnimation = (characterKey: string) => {
    const character = charactersMap.value[characterKey]
    if (!character) return undefined

    const currentEmotion = emotionStates.value[characterKey] ?? 'default'
    return character.image[currentEmotion]?.animation
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
    getCharacterAnimation,
  }
}
