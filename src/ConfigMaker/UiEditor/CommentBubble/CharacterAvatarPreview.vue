<!-- src/ConfigMaker/UiEditor/CommentBubble/CharacterAvatarPreview.vue -->
<template>
  <div class="flex flex-col md:flex-row justify-around gap-4 p-4">
    <!-- 中央表示キャラクター（0番地） -->
    <PreviewSection title="コメント時に表示するキャラクター" color-class="secondary">
      <div v-if="!isCharacter" class="text-gray-500 italic text-sm p-2">キャラクターが存在しません</div>
      <div v-else-if="centerCharacters.length === 0" class="text-gray-500 italic text-sm p-2">
        キャラクターはみんな表示されています！
      </div>
      <div v-else class="flex justify-center">
        <div v-for="character in centerCharacters" :key="character.key" class="-mx-4">
          <CharacterLayerImage
            :layers="getRandomCharacterLayers(character)"
            :size="characterSize"
            :color="character.color"
          />
        </div>
      </div>
    </PreviewSection>

    <!-- 縦線 -->
    <div class="divider md:divider-horizontal my-0"></div>

    <!-- 常時表示キャラクター（1〜4番地） -->
    <PreviewSection title="常時表示キャラクター" color-class="primary">
      <div v-if="slotCharacters.length === 0" class="text-gray-500 italic text-sm p-2">
        常時表示キャラクターが設定されていません
      </div>
      <div v-else class="flex justify-center">
        <div v-for="character in slotCharacters" :key="character.key" class="-mx-4">
          <LayerImage :layers="getRandomCharacterLayers(character)" :size="characterSize" />
        </div>
      </div>
    </PreviewSection>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import type { CharacterType, ShowCharacters } from '@/types'
  import CharacterLayerImage from '@/common/LayerImage/CharacterLayerImage.vue'
  import LayerImage from '@/common/LayerImage/LayerImage.vue'
  import PreviewSection from './PreviewSection.vue'
  import { useVisibilityAccess } from '@config/scripts/useAccessCheckerConfig'

  const props = defineProps<{
    characters: Record<string, CharacterType>
    showCharacters: ShowCharacters
    characterSize: number
  }>()

  const { isCharacter } = useVisibilityAccess()

  /**
   * グループから表示キャラクターを1体選ぶ(表示は最初の配列)
   */
  const selectCharacterFromGroup = (group?: string[]) => {
    if (!group || group.length === 0) return null
    return group[0]
  }

  /**
   * 画像が存在するキャラクターかチェック
   */
  const hasValidImage = (character: CharacterType): boolean => {
    return getRandomCharacterLayers(character).length > 0
  }

  /**
   * キャラクター画像レイヤー取得（ランダム感情）
   */
  const getRandomCharacterLayers = (character: CharacterType): string[] => {
    const images = character.image

    const validEmotions = Object.keys(images).filter((key) => {
      const src = images[key]?.src ?? []
      return src.some((path) => path && path.trim() !== '')
    })

    if (validEmotions.length === 0) return []

    const hasDefault = validEmotions.includes('default')

    if (hasDefault && Math.random() < 0.8) {
      return images['default']?.src ?? []
    }

    const randomEmotion = validEmotions[Math.floor(Math.random() * validEmotions.length)]
    return images[randomEmotion]?.src ?? []
  }

  /**
   * 中央表示キャラクター（0番地）
   */
  const centerCharacters = computed(() => {
    const centerGroup = props.showCharacters.center || []
    return centerGroup
      .map((key) => props.characters[key])
      .filter((char): char is CharacterType => !!char && hasValidImage(char))
  })

  /**
   * 常時表示キャラクター（1〜4番地）
   */
  const slotCharacters = computed(() => {
    const slots = [
      props.showCharacters.slot1,
      props.showCharacters.slot2,
      props.showCharacters.slot3,
      props.showCharacters.slot4,
    ]

    return slots
      .map(selectCharacterFromGroup)
      .filter((key): key is string => !!key)
      .map((key) => props.characters[key])
      .filter((char): char is CharacterType => !!char && hasValidImage(char))
  })
</script>
