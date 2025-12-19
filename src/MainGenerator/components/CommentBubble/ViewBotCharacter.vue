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
            :animated-text="bubbleTextAnimate"
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
  import { useAppStore } from '@/MainGenerator/stores/useAppStore'
  import { useViewBotCharacter } from './composables/useViewBotCharacter'
  import { useCharacterWithComments } from './composables/useCharacterWithComments'
  import CommentDisplay from '@/MainGenerator/components/CommentBubble/CommentDisplay.vue'
  import CharacterAvatar from '@/MainGenerator/components/CommentBubble/CharacterAvatar.vue'
  import type { CharacterType } from '@/types/OmikujiData/CharacterSchema'

  const appStore = useAppStore()
  const { data } = storeToRefs(appStore)

  const showCharacters = data.value.displaySettings.components.bubble.showCharacters
  const characters = computed(() => data.value.characters)

  const { lastCommenterKey, getCharacterImage, getCharacterComments, removeCommentWithIconReset, start, stop } =
    useViewBotCharacter()

  //  修正箇所: slice(1)で1番地以降のみを処理
  const charactersToShow = computed<CharacterType[]>(() => {
    if (!showCharacters || showCharacters.length === 0) {
      return []
    }

    const allCharacters = characters.value
    const finalCharacters: CharacterType[] = []

    //  0番地をスキップして1番地以降を処理
    const visibleGroups = showCharacters.slice(1)

    visibleGroups.forEach((group) => {
      // グループ内のキャラクターキーを逆順で走査する
      const reversedGroup = [...group].reverse()

      let characterToDisplay: CharacterType | undefined = undefined

      for (const key of reversedGroup) {
        const char = allCharacters[key]
        if (!char) continue

        // グループの最初の要素（0番地、つまり最も低い優先度）
        const isDefaultCharacter = key === group[0]

        // そのキャラクターに現在表示中のコメントがあるかチェック
        const comments = getCharacterComments(key)
        const hasComments = comments && comments.length > 0

        if (isDefaultCharacter && !characterToDisplay) {
          // デフォルトキャラクターを暫定的な表示対象とする
          characterToDisplay = char
        } else if (hasComments) {
          // コメントがあるキャラクターは、そのグループの表示対象として確定
          characterToDisplay = char
          break
        }
      }

      // 最終的に表示が決定したキャラクターをリストに追加
      if (characterToDisplay) {
        finalCharacters.push(characterToDisplay)
      }
    })

    // 最終リストを返す
    return finalCharacters
  })

  const base = useCharacterWithComments(null, [], false)

  const getStyle = (key: string) =>
    useCharacterWithComments(characters.value[key], getCharacterComments(key), key === lastCommenterKey.value).style
      .value

  const { enterMotion, bubble, bubbleTextAnimate, showToastFallback } = base

  onMounted(start)
  onUnmounted(stop)
</script>
