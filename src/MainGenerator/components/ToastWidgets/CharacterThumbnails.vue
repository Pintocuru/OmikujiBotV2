<!-- src\MainGenerator\components\OmikujiBot\CharacterThumbnails.vue -->
<template>
  <CharacterThumbnailsPreview
    v-if="characters.length > 0"
    :characters="characters"
    :clickable="true"
    :imageClass="'transition-all duration-500'"
    @character-click="handleCharacterClick"
  />
</template>

<script setup lang="ts">
  import { computed, ref, onMounted, onUnmounted } from 'vue'
  import CharacterThumbnailsPreview from './CharacterThumbnailsPreview.vue'
  import { characterEmotions, CharacterEmotionType, CharacterType, BotMessageSchema, BotMessage } from '@/types/'
  import { useAppStore } from '@/MainGenerator/stores/useAppStore'

  const appStore = useAppStore()

  const characters = computed(() => appStore.characterCollector.getUsedCharacterArray())
  const currentExpressions = ref<CharacterEmotionType[]>([])
  const expressionTimer = ref<ReturnType<typeof setTimeout> | null>(null)

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

      const postAction: BotMessage = BotMessageSchema.parse({
        name: character.name,
        characterKey: character.key,
        iconKey: shouldChangeExpression ? randomEmotion : 'default',
        color: character?.color,
        comment: {
          bubble: !isRightClick ? `${character.name}のテストメッセージです！` : '',
          toast: isRightClick ? `${character.name}のトーストメッセージです！` : '',
        },
      })
      appStore.addBotMessage(postAction)
    } catch (error) {
      console.error('テストメッセージの生成に失敗しました:', error)
    }
  }
</script>
