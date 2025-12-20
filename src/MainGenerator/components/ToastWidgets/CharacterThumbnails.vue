<!-- src\MainGenerator\components\OmikujiBot\CharacterThumbnails.vue -->
<template>
  <div
    class="flex gap-4 mt-2"
    :class="[toastSettings.showToastsOnRight ? 'flex-row self-end' : 'flex-row-reverse self-start']"
  >
    <CharacterThumbnailsPreview
      :characters="characterArray"
      :clickable="true"
      @character-click="handleCharacterClick"
    />
    <CharacterThumbnailsPreview :characters="filteredCharacters" :hoverVisibility="false" />
  </div>
</template>

<script setup lang="ts">
  import { computed, ref, onMounted, onUnmounted } from 'vue'
  import CharacterThumbnailsPreview from './CharacterThumbnailsPreview.vue'
  import { characterEmotions, CharacterEmotionType, CharacterType, BotMessageSchema, BotMessage } from '@/types/'
  import { useAppStore } from '@/MainGenerator/stores/useAppStore'
  import { resolveProfileImage } from '@/MainGenerator/scripts/BotCharacter/ProfileImageResolver'

  const appStore = useAppStore()

  const toastSettings = computed(() => appStore.data.displaySettings.components.toast)
  const characterArray = computed(() => appStore.characterCollector.getUsedCharacterArray())
  const currentExpressions = ref<CharacterEmotionType[]>([])
  const expressionTimer = ref<ReturnType<typeof setTimeout> | null>(null)

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
      const shouldChangeExpression = Math.random() < 0.5
      const randomEmotion = characterEmotions[Math.floor(Math.random() * characterEmotions.length)]

      const postAction: BotMessage = BotMessageSchema.parse({
        name: character.name,
        characterKey: character.key,
        iconKey: shouldChangeExpression ? randomEmotion : 'default',
        profileImage: resolveProfileImage(character, randomEmotion),
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

  // showThumbnail に含まれるキーを持つキャラクターのみをフィルタリング
  const filteredCharacters = computed(() => {
    const selectedKeys = new Set(toastSettings.value.showThumbnail)
    return characterArray.value.filter((character) => selectedKeys.has(character.key))
  })
</script>
