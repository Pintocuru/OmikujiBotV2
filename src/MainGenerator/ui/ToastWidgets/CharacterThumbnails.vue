<!-- src\MainGenerator\ui\OmikujiBot\CharacterThumbnails.vue -->
<template>
  <div
    class="flex gap-4 mt-2"
    :class="[toastSettings.showToastsOnRight ? 'flex-row self-end' : 'flex-row-reverse self-start']"
  >
    <!-- すべてのキャラクターリスト（テスト送信用） -->
    <CharacterThumbnailsPreview
      :charactersArray="characterArray"
      :clickable="true"
      @character-click="handleCharacterClick"
    />
    <!-- 実際にトースト表示設定されているキャラクターのプレビュー -->
    <CharacterThumbnailsPreview :charactersArray="filteredCharacters" :hoverVisibility="false" />
  </div>
</template>

<script setup lang="ts">
  import { computed, ref, onMounted, onUnmounted } from 'vue'
  import { characterEmotions, CharacterType, BotMessageCommentSchema, BotMessageCommentType } from '@/types/'
  import { useAppStore } from '@main/stores/useAppStore'
  import { useCharacterManager } from '@main/scripts/CharacterManager/useCharacterManager'
  import CharacterThumbnailsPreview from '@/common/ui/ToastWidgets/CharacterThumbnailsPreview.vue'

  const appStore = useAppStore()
  const { characterArray, isCharacter, manager } = useCharacterManager()

  const toastSettings = computed(() => appStore.data.components.toast)
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
        if (!manager.isValidCharacter(character.key)) return

        const shouldChange = Math.random() < 0.05
        if (shouldChange) {
          const randomEmotion = characterEmotions[Math.floor(Math.random() * characterEmotions.length)]
          currentExpressions.value[index] = manager.resolveEmotion(character.key, randomEmotion)
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
  const handleCharacterClick = (character: CharacterType, isRightClick: boolean) => {
    try {
      const shouldChangeExpression = Math.random() < 0.5
      const randomEmotion = characterEmotions[Math.floor(Math.random() * characterEmotions.length)]
      const defaultBubbleColor = appStore.data.components.bubble?.defaultColor

      // キャラクターの妥当性を考慮してデータを構成
      const resolvedData = manager.resolveCharacter({
        characterKey: character.key,
        iconKey: shouldChangeExpression ? randomEmotion : 'default',
      })

      const postAction: BotMessageCommentType = BotMessageCommentSchema.parse({
        bubble: {
          name: isCharacter.value ? character.name : 'default',
          message: !isRightClick
            ? `${character.name || 'default'}のテストメッセージです！`
            : `${character.name || 'default'}のトーストメッセージです！`,
          isToast: isRightClick,
          characterKey: isCharacter.value ? resolvedData.characterKey : 'default',
          iconKey: resolvedData.iconKey,
          color: isCharacter.value ? character.color : defaultBubbleColor,
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
    // ライセンス無効時は characterArray 自体がデフォルトのみになっているためそのまま返す
    if (!isCharacter.value) return characterArray.value

    const selectedKeys = new Set(toastSettings.value.showThumbnail)
    return characterArray.value.filter((character) => selectedKeys.has(character.key))
  })
</script>
