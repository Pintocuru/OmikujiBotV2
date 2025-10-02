<!-- src/MainGenerator/components/OmikujiBot/ViewBotCharacter.vue -->
<template>
  <div class="absolute bottom-0 left-0 right-0 flex justify-center items-end">
    <!-- 統合モード: 単一のキャラクター表示 -->
    <CharacterWithComments
      v-if="bundleCharacters"
      :character="firstCharacter"
      :comments="allDisplayedComments"
      :is-active="hasActiveComments"
      :profile-image="getBundledCharacterImage()"
      @remove-comment="removeCommentWithIconReset"
    />

    <!-- 個別モード: 複数のキャラクター表示 -->
    <template v-else>
      <CharacterWithComments
        v-for="character in availableCharacters"
        :key="character.key"
        :character="character"
        :comments="getCharacterComments(character.key)"
        :is-active="character.key === lastCommenterKey"
        :profile-image="getCharacterImage(character)"
        class="-mx-4"
        @remove-comment="(messageId: string) => removeCommentWithIconReset(messageId, character.key)"
      />
    </template>
  </div>
</template>

<script setup lang="ts">
  import { onMounted, onUnmounted, computed } from 'vue'
  import CharacterWithComments from './CharacterWithComments.vue'
  import { useViewBotCharacter } from './composables/useViewBotCharacter'

  const {
    availableCharacters,
    bundleCharacters,
    lastCommenterKey,
    getCharacterImage,
    getCharacterComments,
    removeCommentWithIconReset,
    displayedComments,
    start,
    stop,
  } = useViewBotCharacter()

  // 統合モード用の計算済みプロパティ
  const firstCharacter = computed(() => {
    const characterArray = Object.values(availableCharacters.value)
    if (characterArray.length === 0) return null
    return characterArray.sort((a, b) => (a.order ?? 0) - (b.order ?? 0))[0]
  })

  const getBundledCharacterImage = () => {
    if (!firstCharacter.value) return null

    const key = lastCommenterKey.value
    if (key) {
      const activeCharacter = availableCharacters.value.find((c) => c.key === key)
      if (activeCharacter) return getCharacterImage(activeCharacter)
    }

    return getCharacterImage(firstCharacter.value)
  }

  const allDisplayedComments = computed(() => {
    return displayedComments.value.filter((comment) => comment.visible)
  })

  const hasActiveComments = computed(() => {
    return allDisplayedComments.value.length > 0
  })

  onMounted(() => start())
  onUnmounted(() => stop())
</script>
