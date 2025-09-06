<!-- src\MainGenerator\components\OmikujiBot\CharacterThumbnails.vue -->
<template>
  <div v-if="characters.length > 0" class="fixed bottom-4 right-4 z-50">
    <CharacterThumbnailsPreview
      :characters="characters"
      :displaySize="displaySize"
      :clickable="true"
      :imageClass="'transition-all duration-500'"
      :getImageSrc="getImageSrc"
      @character-click="handleCharacterClick"
    />
  </div>
</template>

<script setup lang="ts">
  import { computed, ref, onMounted, onUnmounted } from 'vue'
  import { characterEmotions, CharacterEmotionType, CharacterType, PostActionSchema, getImagePath } from '@/types/'
  import { useAppStore, useDisplayStore } from '@/MainGenerator/stores/'
  import CharacterThumbnailsPreview from './CharacterThumbnailsPreview.vue'

  const appStore = useAppStore()
  const displayStore = useDisplayStore()

  const characters = computed(() => appStore.characterCollector.getUsedCharacterArray())
  const displaySize = computed(() => displayStore.displaySize)
  const currentExpressions = ref<CharacterEmotionType[]>([])
  const expressionTimer = ref<ReturnType<typeof setTimeout> | null>(null)

  const getImageSrc = (character: CharacterType, index: number): string | undefined => {
    if (!character?.image) return undefined
    const expr = currentExpressions.value[index]
    const imagePath = character.image[expr]
    return imagePath ? getImagePath(imagePath) : undefined
  }

  onMounted(() => {
    currentExpressions.value = characters.value.map(() => 'default')
    if (characters.value.length > 0) startExpressionCycle()
  })

  onUnmounted(() => {
    if (expressionTimer.value) clearTimeout(expressionTimer.value)
  })

  const startExpressionCycle = () => {
    const updateExpressions = () => {
      if (characters.value.length === 0) return

      characters.value.forEach((character, index) => {
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
      const shouldChangeExpression = Math.random() < 0.5
      const randomEmotion = characterEmotions[Math.floor(Math.random() * characterEmotions.length)]
      const messageType = isRightClick ? 'トーストメッセージ' : 'テストメッセージ'

      const postAction = PostActionSchema.parse({
        characterKey: character.id,
        iconKey: shouldChangeExpression ? randomEmotion : 'default',
        messageContent: `${character.name}の${messageType}です！`,
      })

      const testMessage = appStore.characterCollector.generateTestMessage(postAction, isRightClick)
      appStore.addBotMessage(testMessage)
    } catch (error) {
      console.error('テストメッセージの生成に失敗しました:', error)
    }
  }
</script>
