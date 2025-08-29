<!-- src\MainGenerator\components\OmikujiBot\CharacterThumbnails.vue -->
<template>
  <div v-if="characters.length > 0" class="fixed bottom-4 right-4 z-50">
    <div class="flex items-end gap-3" style="flex-direction: row-reverse">
      <div
        v-for="(character, index) in characters"
        :key="character.id"
        class="relative cursor-pointer"
        :style="{ zIndex: characters.length - index }"
        @click="handleCharacterClick(character, false)"
        @contextmenu.prevent="handleCharacterClick(character, true)"
      >
        <!-- キャラクターアバター（画像または背景色） -->
        <div
          class="flex items-center justify-center rounded-full overflow-hidden transition-all duration-300 shadow-lg hover:scale-120"
          :class="[index === 0 ? sizeConfig.primaryAvatar : sizeConfig.secondaryAvatar]"
          :style="{ backgroundColor: character.color.backgroundColor }"
        >
          <img
            v-if="getImageSrc(index)"
            :src="getImageSrc(index)"
            :alt="`${character.name}のアイコン`"
            class="w-full h-full object-cover transition-all duration-500"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed, ref, onMounted, onUnmounted } from 'vue'
  import { characterEmotions, CharacterEmotionType, CharacterType, PostActionSchema, getImagePath } from '@/types/'
  import { useAppStore, useDisplayStore } from '@/MainGenerator/stores/'

  // Piniaストアの使用
  const appStore = useAppStore()
  const displayStore = useDisplayStore()

  // リアクティブ変数
  const characters = computed(() => appStore.characterCollector.getUsedCharacterArray())
  const displaySize = computed(() => displayStore.displaySize)
  const currentExpressions = ref<CharacterEmotionType[]>([])
  const expressionTimer = ref<ReturnType<typeof setTimeout> | null>(null)

  const getImageSrc = (index: number): string | undefined => {
    const character = characters.value[index]
    if (!character?.image) return undefined

    const expr = currentExpressions.value[index]
    const imagePath = character.image[expr]
    return imagePath ? getImagePath(imagePath) : undefined
  }

  // サイズ設定の定数
  const SIZE_CONFIG2 = {
    xs: { primaryAvatar: 'w-8 h-8', secondaryAvatar: 'w-8 h-8' },
    sm: { primaryAvatar: 'w-10 h-10', secondaryAvatar: 'w-10 h-10' },
    md: { primaryAvatar: 'w-12 h-12', secondaryAvatar: 'w-12 h-12' },
    lg: { primaryAvatar: 'w-16 h-16', secondaryAvatar: 'w-16 h-16' },
    xl: { primaryAvatar: 'w-20 h-20', secondaryAvatar: 'w-20 h-20' },
  } as const

  const sizeConfig = computed(() => SIZE_CONFIG2[displaySize.value])

  // 初期化
  onMounted(() => {
    currentExpressions.value = characters.value.map(() => 'default')
    if (characters.value.length > 0) startExpressionCycle()
  })

  // クリーンアップ
  onUnmounted(() => {
    if (expressionTimer.value) clearTimeout(expressionTimer.value)
  })

  // 表情サイクルの開始（10秒に1回抽選を行い、5%で特別な表情）
  const startExpressionCycle = () => {
    const updateExpressions = () => {
      if (characters.value.length === 0) return

      characters.value.forEach((character, index) => {
        if (!character.image) return

        const shouldChange = Math.random() < 0.05
        if (shouldChange) {
          const randomEmotion = characterEmotions[Math.floor(Math.random() * characterEmotions.length)]
          currentExpressions.value[index] = randomEmotion
        } else {
          currentExpressions.value[index] = 'default'
        }
      })
      expressionTimer.value = setTimeout(updateExpressions, 10000)
    }

    updateExpressions()
  }

  // キャラクタークリック時の処理
  const handleCharacterClick = (character: CharacterType, isToast: boolean) => {
    try {
      const shouldChangeExpression = Math.random() < 0.5
      const randomEmotion = characterEmotions[Math.floor(Math.random() * characterEmotions.length)]
      const messageType = isToast ? 'トーストメッセージ' : 'テストメッセージ'

      const postAction = PostActionSchema.parse({
        characterKey: character.id,
        iconKey: shouldChangeExpression ? randomEmotion : 'default',
        // enterMotion: 'pulse',
        messageContent: `${character.name}の${messageType}です！`,
      })

      // テストメッセージを生成し、ストアに追加
      const testMessage = appStore.characterCollector.generateTestMessage(postAction, isToast)
      appStore.addBotMessage(testMessage)
    } catch (error) {
      console.error('テストメッセージの生成に失敗しました:', error)
    }
  }
</script>
