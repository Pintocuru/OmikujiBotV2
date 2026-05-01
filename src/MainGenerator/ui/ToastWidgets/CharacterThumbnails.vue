<!-- src/MainGenerator/ui/ToastWidgets/CharacterThumbnails.vue -->
<template>
  <div
    class="flex gap-4 mt-2"
    :class="[toastSettings.showToastsOnRight ? 'flex-row self-end' : 'flex-row-reverse self-start']"
  >
    <!-- すべてのキャラクターリスト（テスト送信用） -->
    <CharacterThumbnailsPreview
      :charactersArray="clickableCharacters"
      :clickable="true"
      @character-click="handleCharacterClick"
    />
    <!-- 実際にトースト表示設定されているキャラクターのプレビュー -->
    <CharacterThumbnailsPreview :charactersArray="filteredCharacters" :hoverVisibility="false" />
  </div>
</template>

<script setup lang="ts">
  import { computed, ref, onMounted, onUnmounted } from 'vue'
  import {
    CharacterType,
    BotMessageBubbleSchema,
    BotMessageBubbleType,
    characterEmotionKeys,
    CharacterSchema,
    ToastWidgetsSchema,
  } from '@/types'
  import { useAppStore } from '@main/stores/useAppStore'
  import { useCharacterManager } from '@main/scripts/CharacterManager/useCharacterManager'
  import CharacterThumbnailsPreview from './parts/CharacterThumbnailsPreview.vue'

  const appStore = useAppStore()
  const { characterArray, isCharacter, isValidCharacter, resolveCharacter, resolveEmotion } = useCharacterManager()

  const toastSettings = computed(() => appStore.data.components.settings.toast ?? ToastWidgetsSchema.parse({}))
  const currentExpressions = ref<string[]>([])
  const expressionTimer = ref<ReturnType<typeof setTimeout> | null>(null)

  onMounted(() => {
    currentExpressions.value = characterArray.value.map(() => 'default')
    if (characterArray.value.length > 0) startExpressionCycle()
  })

  onUnmounted(() => {
    if (expressionTimer.value) clearTimeout(expressionTimer.value)
  })

  /**
   * サムネイルの表情を定期的にランダム変更する
   */
  const startExpressionCycle = () => {
    const updateExpressions = () => {
      if (characterArray.value.length === 0) return

      characterArray.value.forEach((character, index) => {
        if (!isValidCharacter(character.key)) return

        const shouldChange = Math.random() < 0.05
        if (shouldChange) {
          const randomEmotion = characterEmotionKeys[Math.floor(Math.random() * characterEmotionKeys.length)]
          currentExpressions.value[index] = resolveEmotion(character.key, randomEmotion)
        } else {
          currentExpressions.value[index] = 'default'
        }
      })
      expressionTimer.value = setTimeout(updateExpressions, 10000)
    }
    updateExpressions()
  }

  /**
   * キャラクタークリック時のテストメッセージ送信
   */
  const TEST_CHARACTER = CharacterSchema.parse({
    key: '__test__',
    name: 'テスト',
    color: appStore.data.components.commonStyle.defaultColor,
  })
  const clickableCharacters = computed(() => {
    if (!isCharacter.value) return [TEST_CHARACTER]
    return [TEST_CHARACTER, ...characterArray.value]
  })

  const handleCharacterClick = (character: CharacterType, isRightClick: boolean) => {
    try {
      const shouldChangeExpression = Math.random() < 0.5
      const randomEmotion = characterEmotionKeys[Math.floor(Math.random() * characterEmotionKeys.length)]

      // キャラクターの妥当性を考慮してデータを構成
      const resolvedData = resolveCharacter({
        characterKey: character.key,
        iconKey: shouldChangeExpression ? randomEmotion : 'default',
      })

      const postAction: BotMessageBubbleType = BotMessageBubbleSchema.parse({
        bubble: {
          name: character.name,
          message: `${character.name}の${isRightClick ? 'トースト' : 'テスト'}メッセージです！`,
          isToast: isRightClick,
          characterKey: resolvedData.characterKey ?? null,
          iconKey: resolvedData.iconKey,
        },
      })

      appStore.addBotMessage(postAction)
    } catch (error) {
      console.error('テストメッセージの生成に失敗しました:', error)
    }
  }

  /**
   * 設定（showThumbnail）に含まれるキーを持つキャラクターのみをフィルタリング
   */
  const filteredCharacters = computed(() => {
    if (!isCharacter.value) return []

    const selectedKeys = new Set(toastSettings.value.showThumbnail)
    return characterArray.value.filter((character) => selectedKeys.has(character.key))
  })
</script>
