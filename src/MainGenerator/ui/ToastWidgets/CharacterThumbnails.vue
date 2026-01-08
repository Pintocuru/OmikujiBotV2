<!-- src\MainGenerator\ui\OmikujiBot\CharacterThumbnails.vue -->
<template>
  <div
    class="flex gap-4 mt-2"
    :class="[toastSettings.showToastsOnRight ? 'flex-row self-end' : 'flex-row-reverse self-start']"
  >
    <CharacterThumbnailsPreview
      :charactersArray="characterArray"
      :clickable="true"
      @character-click="handleCharacterClick"
    />
    <CharacterThumbnailsPreview :charactersArray="filteredCharacters" :hoverVisibility="false" />
  </div>
</template>

<script setup lang="ts">
  import { computed, ref, onMounted, onUnmounted } from 'vue'
  import { characterEmotions, CharacterEmotionType, CharacterType, BotMessageSchema, BotMessageType } from '@/types/'
  import { useAppStore } from '@main/stores/useAppStore'
  import { useVisibilityAccess } from '@main/scripts/FeatureAccess/useAccessCheckerMain'
  import { useCharacterManager } from '@main/scripts/CharacterManager/useCharacterManager'
  import CharacterThumbnailsPreview from '@/common/ui/ToastWidgets/CharacterThumbnailsPreview.vue'

  const appStore = useAppStore()
  const { characterArray } = useCharacterManager()

  const toastSettings = computed(() => appStore.data.components.toast)
  const currentExpressions = ref<CharacterEmotionType[]>([])
  const expressionTimer = ref<ReturnType<typeof setTimeout> | null>(null)

  // ライセンス状態で閲覧できないなら表示させない
  const { isCharacter } = useVisibilityAccess()

  onMounted(() => {
    currentExpressions.value = characterArray.value.map(() => 'default')
    if (characterArray.value.length > 0) startExpressionCycle()
  })

  onUnmounted(() => {
    if (expressionTimer.value) clearTimeout(expressionTimer.value)
  })

  const startExpressionCycle = () => {
    const updateExpressions = () => {
      if (characterArray.value.length === 0) return

      characterArray.value.forEach((character, index) => {
        if (!character.image) return
        const shouldChange = Math.random() < 0.05
        currentExpressions.value[index] = shouldChange
          ? characterEmotions[Math.floor(Math.random() * characterEmotions.length)]
          : 'default'
      })
      expressionTimer.value = setTimeout(updateExpressions, 10000)
    }
    updateExpressions()
  }

  const handleCharacterClick = (character: CharacterType, isRightClick: boolean) => {
    try {
      const { defaultBubbleColor, defaultToastColor } = useCharacterManager()
      const shouldChangeExpression = Math.random() < 0.5
      const randomEmotion = characterEmotions[Math.floor(Math.random() * characterEmotions.length)]

      const postAction: BotMessageType = BotMessageSchema.parse({
        type: 'system',
        bubble: {
          name: isCharacter ? character.name : null,
          message: !isRightClick
            ? `${character.name || 'default'}のテストメッセージです！`
            : `${character.name || 'default'}のトーストメッセージです！`,
          isToast: isRightClick,
          characterKey: isCharacter ? character.key : null,
          iconKey: shouldChangeExpression ? randomEmotion : 'default',
          color: isCharacter ? character.color : !isRightClick ? defaultBubbleColor.value : defaultToastColor.value,
        },
      })

      appStore.addBotMessage(postAction)
    } catch (error) {
      console.error('テストメッセージの生成に失敗しました:', error)
    }
  }

  // showThumbnail に含まれるキーを持つキャラクターのみをフィルタリング
  const filteredCharacters = computed(() => {
    if (!isCharacter) return characterArray.value
    const selectedKeys = new Set(toastSettings.value.showThumbnail)
    return characterArray.value.filter((character) => selectedKeys.has(character.key))
  })
</script>
