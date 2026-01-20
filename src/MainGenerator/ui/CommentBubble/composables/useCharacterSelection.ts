// src/MainGenerator/composables/useCharacterSelection.ts
import { computed, Ref } from 'vue'
import { ShowCharacters, CharacterType, BotMessageBubbleType, characterEmotionKeys } from '@/types/'
import { useCharacterManager } from '@/MainGenerator/scripts/CharacterManager/useCharacterManager'

const defaultCharacterKey = 'default'

/**
 * キャラクター選択ロジックを集約
 * - グループからキャラクターを選択
 * - 表示するキャラクターリストを生成
 */
export function useCharacterSelection(
  displayedComments: Ref<BotMessageBubbleType[]>,
  showCharacters: Ref<ShowCharacters>,
  charactersMap: Ref<Record<string, CharacterType>>
) {
  // 最新コメントのキャラクターキーを取得
  const latestCommenterKey = computed(() => {
    const visibleMessages = displayedComments.value.filter((m) => m.display?.visible)
    return visibleMessages[0]?.bubble?.characterKey ?? null
  })

  // 指定キャラクターのメッセージ数を取得
  const getMessageCount = (characterKey: string): number => {
    return displayedComments.value.filter((m) => m.bubble?.characterKey === characterKey).length
  }

  /**
   * グループから表示するキャラクターを選択
   * 1. 最新コメントがグループ内にあればそれを優先
   * 2. コメント数が多い順
   * 3. グループの先頭
   */
  const selectCharacterFromGroup = (group: string[]): string | null => {
    if (!group?.length) return defaultCharacterKey
    const { isValidCharacter } = useCharacterManager()

    // 1. 最新コメントがこのグループ内なら優先
    if (latestCommenterKey.value && group.includes(latestCommenterKey.value)) {
      const character = charactersMap.value[latestCommenterKey.value]

      // ⚠️ キャラクターは存在するが画像がない場合の警告
      if (character && !isValidCharacter(latestCommenterKey.value)) {
        console.warn(
          `[CharacterSelection] Character "${latestCommenterKey.value}" exists but has no images. ` +
            `Falling back to default character.`,
          { character, availableEmotions: Object.keys(character.image || {}) }
        )
      } else if (isValidCharacter(latestCommenterKey.value)) {
        return latestCommenterKey.value
      }
    }

    // 2. コメント数が最も多いキャラクターを探す
    const withCounts = group.map((key) => ({
      key,
      count: getMessageCount(key),
    }))

    const hasComments = withCounts.find((c) => c.count > 0)
    if (hasComments) {
      const sortedKeys = withCounts.sort((a, b) => b.count - a.count)
      const selectedKey = sortedKeys[0].key
      const character = charactersMap.value[selectedKey]

      // ⚠️ 警告
      if (character && !isValidCharacter(selectedKey)) {
        console.warn(
          `[CharacterSelection] Character "${selectedKey}" exists but has no images. ` +
            `Falling back to default character.`,
          { character, availableEmotions: Object.keys(character.image || {}) }
        )
      } else if (isValidCharacter(selectedKey)) {
        return selectedKey
      }
    }

    // 3. グループ内で最初に有効なキャラクターを探す
    for (const key of group) {
      const character = charactersMap.value[key]

      if (character && !isValidCharacter(key)) {
        console.warn(`[CharacterSelection] Character "${key}" exists but has no images. Skipping.`, {
          character,
          availableEmotions: Object.keys(character.image || {}),
        })
        continue
      }

      if (isValidCharacter(key)) {
        return key
      }
    }

    // 4. 有効なキャラクターがない場合
    console.warn(`[CharacterSelection] No valid characters with images found in group. Falling back to default.`, {
      group,
      charactersInMap: Object.keys(charactersMap.value),
    })

    return defaultCharacterKey
  }

  // 0番地（中央）に表示するメッセージ
  // 0番地（中央）に表示するメッセージ
  const centerMessages = computed(() => {
    const allowKeys = showCharacters.value.center ?? []
    if (allowKeys.length === 0) return []

    return displayedComments.value.filter((message) => {
      // キャラクター非表示モード（null）の場合は表示
      if (!message.bubble?.characterKey) return true

      const characterKey = message.bubble.characterKey

      // allowKeys に含まれていればフキダシは表示する
      // ※ キャラクター画像があるかどうかは別問題
      return allowKeys.includes(characterKey)
    })
  })

  // 1〜4番地に表示するキャラクターリスト
  const slotCharacters = computed<Array<{ slotIndex: number; character: CharacterType }>>(() => {
    const slots = [
      showCharacters.value.slot1,
      showCharacters.value.slot2,
      showCharacters.value.slot3,
      showCharacters.value.slot4,
    ]

    return slots
      .map((group, index) => {
        const key = selectCharacterFromGroup(group)
        if (!key) return null

        // keyがdefaultの場合も含めて、charactersMapから取得を試みる
        let character = charactersMap.value[key]

        // キャラクターが見つからない場合、defaultキャラクターにフォールバック
        if (!character && key !== defaultCharacterKey) {
          character = charactersMap.value[defaultCharacterKey]
        }

        // それでも見つからない場合はnullを返す
        if (!character) return null

        return {
          slotIndex: index + 1,
          character,
        }
      })
      .filter(Boolean) as Array<{ slotIndex: number; character: CharacterType }>
  })

  /**
   * 開発時用：全キャラクターの画像状態を検証
   */
  const validateAllCharacters = () => {
    if (import.meta.env.MODE !== 'development') return

    const issues: string[] = []

    Object.entries(charactersMap.value).forEach(([key, character]) => {
      if (key === 'default') return // defaultは特別扱い

      const hasAnyImage = characterEmotionKeys.some((emotion) => {
        const imagePaths = character.image?.[emotion]
        return imagePaths?.some((path: string) => path && path.trim() !== '')
      })

      if (!hasAnyImage) {
        issues.push(`⚠️ Character "${key}" (${character.name}) has NO images in any emotion state!`)
      }

      const emptyEmotions = characterEmotionKeys.filter((emotion) => {
        const imagePaths = character.image?.[emotion]
        return !imagePaths || imagePaths.every((path: string) => !path || path.trim() === '')
      })

      if (emptyEmotions.length > 0 && emptyEmotions.length < characterEmotionKeys.length) {
        console.info(`ℹ️ Character "${key}" is missing images for: ${emptyEmotions.join(', ')}`)
      }
    })

    if (issues.length > 0) {
      console.error(
        '❌ CHARACTER VALIDATION FAILED\n' +
          issues.join('\n') +
          '\n\nThese characters will fall back to default and may cause display issues.'
      )
    } else {
      console.log('✅ All characters have valid images')
    }
  }

  return {
    latestCommenterKey,
    centerMessages,
    slotCharacters,
    getMessageCount,
    validateAllCharacters,
  }
}
