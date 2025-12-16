<!-- src\ConfigMaker\components\displaySettings\CharacterPreview.vue -->
<template>
  <div class="flex justify-center">
    <div v-for="character in displayCharacters" :key="character.key" class="-mx-4">
      <CharacterAvatar
        v-if="character.image?.default"
        :profile-image="character.image.default"
        :background-color="character.color?.backgroundColor"
        :showCharacterFrame="false"
        :characterSize="characterSize"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed, ref } from 'vue'
  import CharacterAvatar from '@/MainGenerator/components/CommentBubble/CharacterAvatar.vue'
  import { CharacterType } from '@/types/OmikujiData/CharacterSchema'
  import { useMessageFilterCore } from '@/MainGenerator/components/CommentBubble/composables/useMessageFilterCore'
  import type { BotMessage } from '@/types/'

  const props = defineProps<{
    characters: Record<string, CharacterType>
    showCharacters: string[][]
    characterSize: number
  }>()

  /**
   * プレビュー用なので空メッセージ
   */
  const botMessages = ref<BotMessage[]>([])

  /**
   * showCharacters はそのまま渡す
   */
  const { visibleCharacterGroups, zeroIndexMessages } = useMessageFilterCore(
    botMessages,
    computed(() => props.showCharacters)
  )

  /**
   * 表示キャラ決定
   * - 0番地があればそれ
   * - なければ visible groups
   */
  const displayCharacters = computed(() => {
    const keys =
      zeroIndexMessages.value.length > 0
        ? props.showCharacters[0]
        : visibleCharacterGroups.value.map((v) => v.characterKey)

    return keys.map((key) => props.characters[key]).filter(Boolean)
  })
</script>
