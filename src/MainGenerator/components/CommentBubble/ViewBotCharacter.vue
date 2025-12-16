<!-- src/MainGenerator/components/OmikujiBot/ViewBotCharacter.vue -->
<template>
  <div class="absolute bottom-0 left-0 right-0 flex justify-center items-end">
    <CharacterWithComments
      v-for="character in charactersToShow"
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
  import { useAppStore } from '@/MainGenerator/stores/useAppStore'
  import { storeToRefs } from 'pinia'
  import { CharacterType } from '@/types/OmikujiData/CharacterSchema'

  // Piniaストアの使用
  const appStore = useAppStore()
  const { data } = storeToRefs(appStore)

  // showCharacters と characters はそのまま使用
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

  onMounted(() => start())
  onUnmounted(() => stop())
</script>
