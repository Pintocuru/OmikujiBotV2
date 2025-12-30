// src\MainGenerator\scripts\CharacterManager\useCharacterManager.ts
import { computed } from 'vue'
import { CharacterSchema, CharacterType, ShowCharactersSchema } from '@/types'
import { createCharacterEmotions } from '@/common/CharacterManager/createCharacterManager'
import { useAppStore } from '@/MainGenerator/stores/useAppStore'
import { useVisibilityAccess } from '@/MainGenerator/scripts/FeatureAccess/useAccessCheckerMain'

export const useCharacterManager = () => {
  const appStore = useAppStore()

  // ライセンス状態で閲覧できないなら表示させない
  const { isCharacter } = useVisibilityAccess()

  const defaultBubbleColor = computed(() => appStore.data.components.bubble.defaultColor)
  const defaultToastColor = computed(() => appStore.data.components.toast.defaultColor)

  // 使用されているキャラクターデータを取得
  const charactersMap = computed(() => {
    if (!isCharacter.value) {
      return {
        default: CharacterSchema.parse({
          key: 'default',
          color: appStore.data.components.bubble.defaultColor,
        }),
      }
    }

    return appStore.data.characters
  })

  // 使用されているキャラクターのプリセットを配列で取得
  const characterArray = computed(() => {
    if (!isCharacter.value)
      return [
        CharacterSchema.parse({
          key: 'default',
          color: appStore.data.components.toast.defaultColor,
        }),
      ]

    const characters = appStore.data.characters
    if (Object.keys(characters).length === 0) return []
    return Object.values(characters).sort((a, b) => a.order - b.order)
  })

  // orderが一番若いキャラクターを取得
  // TODO:実装
  const getFirstCharacter = (): CharacterType | null => {
    const characters = appStore.data.characters
    if (Object.keys(characters).length === 0) return null
    return Object.values(characters)[0]
  }

  const showCharacters = computed(() => {
    if (isCharacter.value) return appStore.data.components.bubble.showCharacters

    // キャラクターを表示しないときの showCharacters の default
    return ShowCharactersSchema.parse({ center: ['default'] })
  })

  return {
    charactersMap,
    characterArray,
    getFirstCharacter,
    showCharacters,
    defaultBubbleColor,
    defaultToastColor,
    ...createCharacterEmotions(charactersMap),
  }
}
