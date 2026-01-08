// src/MainGenerator/composables/useCharacterEmotionState.ts
import { ref, computed, watch, type Ref } from 'vue'
import type { BotMessageType, CharacterEmotionType, CharacterType } from '@/types/'
import { DisplayBotMessage } from './useBotDisplay'

/**
 * キャラクターの感情状態（アイコン）を管理
 * - 各キャラクターの現在の感情を追跡
 * - コメントに基づいて感情を自動更新
 */
export function useCharacterEmotionState(
  displayedComments: Ref<DisplayBotMessage[]>,
  charactersMap: Ref<Record<string, CharacterType>>
) {
  // キャラクターごとの現在の感情状態
  const emotionStates = ref<Record<string, CharacterEmotionType>>({})

  // 指定キャラクターの表示中コメント一覧
  const getVisibleComments = (characterKey: string): BotMessageType[] => {
    return displayedComments.value.filter((m) => m.bubble?.characterKey === characterKey && m.visible)
  }

  // 指定キャラクターの最新の感情を取得
  const getLatestEmotion = (characterKey: string): CharacterEmotionType => {
    const comments = getVisibleComments(characterKey)
    return comments[0]?.bubble?.iconKey ?? 'default'
  }

  // 全キャラクターの感情状態を更新
  const updateAllEmotions = () => {
    const characterKeys = Object.keys(charactersMap.value)

    characterKeys.forEach((key) => {
      emotionStates.value[key] = getLatestEmotion(key)
    })
  }

  // 特定キャラクターの感情状態のみ更新
  const updateCharacterEmotion = (characterKey: string) => {
    emotionStates.value[characterKey] = getLatestEmotion(characterKey)
  }

  // 指定キャラクターの現在の画像レイヤーを取得
  const getCharacterLayers = (characterKey: string): string[] => {
    const character = charactersMap.value[characterKey]
    if (!character) return []

    const emotion = emotionStates.value[characterKey] ?? 'default'
    return character.image[emotion] || character.image.default || []
  }

  // コメント変更を監視して自動更新
  watch(
    displayedComments,
    () => {
      updateAllEmotions()
    },
    { deep: true, immediate: true }
  )

  return {
    emotionStates: computed(() => emotionStates.value),
    getVisibleComments,
    getCharacterLayers,
    updateCharacterEmotion,
    updateAllEmotions,
  }
}
