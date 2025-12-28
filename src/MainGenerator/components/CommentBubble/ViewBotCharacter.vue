<!-- src/MainGenerator/components/OmikujiBot/ViewBotCharacter.vue -->
<template>
  <div class="absolute bottom-0 left-0 right-0 flex justify-center items-end">
    <div
      v-for="character in charactersToShow"
      :key="character.key"
      class="relative pointer-events-auto -mx-4"
      :style="getStyle(character.key)"
    >
      <div class="relative flex flex-col items-center">
        <div class="absolute bottom-full mb-[240px] left-1/2 -translate-x-1/2 min-w-[320px] max-w-[90vw]">
          <CommentDisplay
            :displayed-comments="getCharacterComments(character.key)"
            :remove-comment="(id) => removeCommentWithIconReset(id, character.key)"
            :enter-motion="enterMotion"
            :leave-motion="enterMotion"
            :animated-text="bubble.bubbleTextAnimate"
            :show-toast-fallback="showToastFallback"
          />
        </div>

        <CharacterAvatar
          v-if="getCharacterImage(character)"
          class="flex justify-center items-end"
          :profileImage="getCharacterImage(character)"
          :characterSize="bubble.characterSize"
          :backgroundColor="character.color?.backgroundColor"
          :showCharacterFrame="false"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed, onMounted, onUnmounted } from 'vue'
  import { storeToRefs } from 'pinia'
  import type { CharacterType } from '@/types/OmikujiData/CharacterSchema'
  import { useAppStore } from '@/MainGenerator/stores/useAppStore'
  import { useViewBotCharacter } from './composables/useViewBotCharacter'
  import CommentDisplay from '@/MainGenerator/components/CommentBubble/CommentDisplay.vue'
  import CharacterAvatar from '@/MainGenerator/components/CommentBubble/CharacterAvatar.vue'

  const appStore = useAppStore()
  const { data } = storeToRefs(appStore)

  const showCharacters = computed(() => data.value.components.bubble.showCharacters)
  const characters = computed(() => data.value.characters)
  const bubble = computed(() => data.value.components.bubble)
  const conditions = computed(() => data.value.components.conditions || [])
  const showToastFallback = computed(() => !conditions.value.includes('toast'))

  const {
    lastCommenterKey,
    getCharacterImage,
    getCharacterComments,
    removeCommentWithIconReset,
    enterMotion,
    start,
    stop,
  } = useViewBotCharacter()

  const getStyle = (key: string) => {
    const isActive = key === lastCommenterKey.value
    return {
      zIndex: isActive ? 50 : 0,
      filter: isActive ? 'brightness(100%)' : 'brightness(60%)',
    }
  }

  const resolveGroupCharacter = (group: string[], lastCommenterKey?: string): string | undefined => {
    if (!group.length) return

    // 最新コメントがこのグループ内ならそれを優先
    if (lastCommenterKey && group.includes(lastCommenterKey)) {
      return lastCommenterKey
    }

    // それ以外は先頭(デフォルト)
    return group[0]
  }

  // slot1〜slot4のキャラを順に並べる
  const charactersToShow = computed<CharacterType[]>(() => {
    const sc = showCharacters.value
    if (!sc) return []

    const allCharacters = characters.value
    const lastKey = lastCommenterKey.value
    const result: CharacterType[] = []

    const slots = [sc.slot1, sc.slot2, sc.slot3, sc.slot4]

    slots.forEach((group) => {
      const key = resolveGroupCharacter(group, lastKey)
      if (!key) return

      const char = allCharacters[key]
      if (char) result.push(char)
    })

    return result
  })

  onMounted(start)
  onUnmounted(stop)
</script>
