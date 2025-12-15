<!-- src/MainGenerator/components/OmikujiBot/ViewBotCharacter.vue -->
<template>
  <div class="absolute bottom-0 left-0 right-0 flex justify-center items-end">
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
  </div>
</template>

<script setup lang="ts">
  import { onMounted, onUnmounted, computed } from 'vue'
  import CharacterWithComments from './CharacterWithComments.vue'
  import { useViewBotCharacter } from './composables/useViewBotCharacter'

  const {
    availableCharacters,
    lastCommenterKey,
    getCharacterImage,
    getCharacterComments,
    removeCommentWithIconReset,
    start,
    stop,
  } = useViewBotCharacter()

  onMounted(() => start())
  onUnmounted(() => stop())
</script>
